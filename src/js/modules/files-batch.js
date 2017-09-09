import {GS as GS} from './globals'

export default {
    /*generic_dialog
        _DEFAULT_SETTING = {
type: "default",
graphic: false,
title: "",
body: "BODY",
body_template: null,
$body: null,
show_go_button: true,
show_secondary_go_button: false,
show_cancel_button: true,
go_button_text: _OKAY_TEXT,
go_button_class: "",
secondary_go_button_text: _OKAY_TEXT,
secondary_go_button_class: "",
cancel_button_text: _CANCEL_TEXT,
onGo: null,
onSecondaryGo: null,
onCancel: null,
onEnd: null,
show_throbber: false,
esc_for_ok: false,
onShow: null,
force_small: false,
enter_always_gos: false,
fullscreen: false,
dialog_class: null,
hide_footer: false,
backdrop_click_to_dismiss: false
}
    */
    deleteFiles: function () {
        TS.generic_dialog.start({
            title: 'Delete selected files',
            body: GS.templates.batchDeleteBody(),
            show_cancel_button: true,
            show_go_button: true,
            go_button_text: "Yes, delete these files",
            go_button_class: "btn_danger",
            cancel_button_text: "Cancel",
            onGo: function () {
                for (let id in GS.data.selectedFiles) {
                    if (GS.data.selectedFiles[id].can_delete) {
                        GS.data.delQueue.push(GS.data.selectedFiles[id]);
                        if (GS.data.viewFiles[id]) {
                            $(GS.ui.getFileItem(id)).trigger('file:delete', [function (id, fileTitle, error) {
                                if (error) {
                                    GS.data.delQueue.reject(id);
                                } else {
                                    GS.data.delQueue.pop(id);
                                }
                                $('#delete_progress').trigger('progress:update');
                            }]);
                        } else {
                            GS.files.deleteFile(id, function (id, error) {
                                if (error) {
                                    GS.data.delQueue.reject(id);
                                } else {
                                    GS.data.delQueue.pop(id);
                                    GS.data.deleteFile(id);
                                }
                                GS.files.batch.updateFileTools();
                                $('#delete_progress').trigger('progress:update');
                                GS.data.saveData();
                            });
                        }
                    }
                }
                GS.files.batch.deleteProgress();
            }
        });
    },
    deleteProgress: function () {
        let title = 'Deleting Files';
        let txt = GS.templates.progresBar({
            id: 'delete_progress',
            text: GS.data.delQueue.popped + '/' + GS.data.delQueue.pushed + ' files deleted',
            type: 'success',
            val: 0
        });
        GS.ui.showPageAlert({
            body: txt,
            dismissable: false,
            type: 'info',
            id: 'delete_progress_alert'
        });
        $('#delete_progress').on('progress:update', function (event) {
            let percent = GS.data.delQueue.popped / GS.data.delQueue.pushed * 100;
            if (GS.data.delQueue.rejected > 0) {
                $(this).addClass('progress-bar-warning');
            }
            $(this).width(percent + '%').next().html(GS.data.delQueue.popped + '/' + GS.data.delQueue.pushed + ' files deleted');
            if (GS.data.delQueue.popped >= GS.data.delQueue.pushed) {
                GS.ui.dismissPageAlert($('#delete_progress_alert'));
                let toats = {
                    type: 'success',
                    message: GS.data.delQueue.popped + ' files deleted'
                };
                let alert = {
                    body: toats.message,
                    dismissable: true,
                    type: 'success',
                    id: 'delete_complete_alert'
                };
                if (GS.data.delQueue.rejected) {
                    toats = {
                        type: 'warning',
                        message: GS.data.delQueue.accepted + ' files deleted - ' + GS.data.delQueue.rejected + ' files failed'
                    };
                    alert.body = toats.message;
                    alert.type = toats.type;
                }
                GS.ui.showPageAlert(alert);
                GS.ui.showToast(toats);
                GS.data.delQueue.reset();
            }
        });
    },
    downloadFiles: function () {
        let totalBytes = 0;
        let totalSize = '';
        for (let id in GS.data.downloadFiles) {
            totalBytes += GS.data.downloadFiles[id].size;
        }
        if (totalBytes > 1000000000) {
            totalSize = (totalBytes / 1000000000).toFixed(2) + ' Gb';
        } else if (totalBytes > 1000000) {
            totalSize = (totalBytes / 1000000).toFixed(2) + ' Mb';
        } else if (totalBytes > 1000) {
            totalSize = (totalBytes / 1000).toFixed(2) + ' Kb';
        } else {
            totalSize = totalBytes + ' Bytes';
        }
        TS.generic_dialog.start({
            title: 'Download selected files',
            body: GS.templates.batchDownloadBody(totalSize),
            show_cancel_button: true,
            show_go_button: true,
            go_button_text: "Yes, download these files",
            cancel_button_text: "Cancel",
            onGo: function () {
                $('body').append('<div id="download_queue" style="display:none">');
                let $downloadQueue = $('#download_queue');
                for (let id in GS.data.downloadFiles) {
                    $downloadQueue.append('<a href="' + GS.data.downloadFiles[id].url_private_download + '" download>');
                }
                $('#download_queue').find('a').each(function (el) {
                    $(this)[0].click();
                });
                $downloadQueue.remove();
            }
        });
    },
    deselectFiles: function () {
        for (let id in GS.data.selectedFiles) {
            GS.files.selectFile(id, 'deselect');
        }
        GS.data.saveData();
        let i = 0;
        let elements = $($('.file_list_item.file_item_selected').get().reverse());
        elements.each(function (index, el) {
            let id = GS.ui.getItemFileId(el);
            if (GS.ui.isVisible(el)) {
                setTimeout(function () {
                    $(el).trigger('file:select', ['deselect']);
                }, GS.cfg.anim.delay * i++);
            } else {
                $(el).trigger('file:select', ['deselect']);
            }
        });
    },
    selectAllCb: function (event) {
        let checked = $(this).is(":checked");
        let i = 0;
        let elements = checked ? $('.file_item:not(.file_item_selected)') : $($('.file_item.file_item_selected').get().reverse());
        elements.each(function (index, el) {
            let sel = GS.files.selectFile(GS.ui.getItemFileId(el), 'toggle');
            if (sel === 'full') {
                return false;
            }
            if (GS.ui.isVisible(el)) {
                setTimeout(function () {
                    $(el).trigger('file:select', [sel]);
                }, GS.cfg.anim.delay * i++);
            } else {
                $(el).trigger('file:select', [sel]);
            }
        });
        $('.files_select_all_cb').prop('checked', checked);
        GS.data.saveData();
    },
    updateFileTools: function () {
        $('#selected_files').text(GS.sizeOf(GS.data.selectedFiles));
        $('#download_files_count').text(GS.sizeOf(GS.data.downloadFiles));
        $('#delete_files_count').text(GS.sizeOf(GS.data.deleteFiles));
        $('#deselect_files_count').text(GS.sizeOf(GS.data.selectedFiles));
        $('#files_batch_download_btn').attr('disabled', GS.sizeOf(GS.data.downloadFiles) === 0);
        $('#files_batch_delete_btn').attr('disabled', GS.sizeOf(GS.data.deleteFiles) === 0);
        $('#files_batch_deselect_btn').attr('disabled', GS.sizeOf(GS.data.selectedFiles) === 0);

        if (GS.sizeOf(GS.data.selectedFilesView) == GS.sizeOf(GS.data.viewFiles)) {
            $('.files_select_all_cb').prop('checked', true);
        } else {
            $('.files_select_all_cb').prop('checked', false);
        }

        $('#view_files_from').text(GS.paging.from);
        $('#view_files_to').text(GS.paging.to);
        $('#view_files_total').text(GS.paging.total);
    }
};
