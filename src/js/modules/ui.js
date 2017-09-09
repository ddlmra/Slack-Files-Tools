import {GS as GS} from './globals'

export default {
    getFileItem: function (selector) {
        if ($(selector).length > 0) {
            return GS.ui.getParentFileItem(selector);
        }
        return $('#file_' + selector);
    },
    getParentFileItem: function (child) {
        return $(child).closest('.file_list_item');
    },
    getItemFileId: function (item) {
        let id = $(item).data('file-id');
        if (id === undefined) {
            id = GS.ui.getParentFileItem(item).data('file-id');
        }
        return id;
    },
    getItemFileTitle: function (item) {
        return GS.ui.getParentFileItem(item).find('.title a').text().replace(/(?:\s|[\r\n])*(.+)[\r\n]*.*/, '$1');
    },
    isVisible: function (fileItem) {
        let el = $(fileItem);
        let docViewTop = $(window).scrollTop();
        let docViewBottom = docViewTop + $(window).height();

        let elemTop = el.offset().top;
        let elemBottom = elemTop + el.height();
        return ((elemTop <= docViewBottom) && (elemBottom >= docViewTop));
    },
    removeAnim: function (fileItem, callback) {
        let el = $(fileItem);
        return el.css({transition: "none"}).animate({left: "-=" + (el.closest('#files_div').width() + 200)}, GS.cfg.anim.time, function () {
            $(this).css({height: $(this).height(), padding: 0, border: 0, overflow: 'hidden'});
        }).animate({height: 0, margin: -6}, GS.cfg.anim.time, function () {
            $(this).remove();
            $(window).trigger("resize");
            if (typeof callback === 'function') {
                callback(el);
            }
        });
    },
    shakeAnim: function (fileItem, callback) {
        let el = $(fileItem);
        let time = 20;
        let width = 20;
        el.css({transition: "none"})
            .animate({left: '-=' + (width / 2)}, time)
            .animate({left: '+=' + width}, time)
            .animate({left: '-=' + width}, time)
            .animate({left: '+=' + width}, time)
            .animate({left: '-=' + (width / 2)}, time, function () {
                el.removeAttr('style');
                if (typeof callback === 'function') {
                    callback(el);
                }
            });
    },
    activateFileItem: function (fileItem, selection) {
        let el = $(fileItem);
        switch (selection) {
            case 'select':
                el.addClass('file_item_selected').removeClass('selecting');
                break;
            case 'deselect':
                el.removeClass('file_item_selected').removeClass('selecting');
                break;
            case 'toggle':
                if (el.hasClass('file_item_selected')) {
                    return GS.ui.activateFileItem(el, 'deselect');
                } else {
                    return GS.ui.activateFileItem(el, 'select');
                }
                break;
            default:
                GS.ui.activateFileItem(el, 'select');
                GS.ui.shakeAnim(el, function (el) {
                    GS.ui.activateFileItem(el, 'deselect');
                });
        }
        return selection;
    },
    showToast: function (config) {
        switch (config.type) {
            case 'info':
                TS.ui.toast.show(config);
                $('.toast').addClass('alert_info');
                break;
            default:
                TS.ui.toast.show(config);
        }
    },

    showPageAlert: function (config) {
        let conf = {
            body: '&nbsp;',
            type: 'info',
            icon: 'ts_icon_info',
            id: '',
            dismissable: false,
        };
        conf.type = ['info', 'success', 'warning', 'error'].indexOf(config.type) >= 0 ? config.type : conf.type;
        conf.body = config.body ? config.body : conf.body;
        conf.id = config.id ? config.id : conf.id;
        conf.icon = config.icon ? config.icon : conf.icon;
        conf.dismissable = config.dismissable === undefined ? conf.dismissable : config.dismissable;
        if (!config.icon) {
            switch (conf.type) {
                case 'info':
                    conf.icon = 'ts_icon_info';
                    break;
                case 'success':
                    conf.icon = 'ts_icon ts_icon_check_circle_o';
                    break;
                case 'warning':
                    conf.icon = 'ts_icon_warning';
                    break;
                case 'error':
                    conf.icon = 'ts_icon_warning';
                    break;
            }
        }
        let alert = $(GS.templates.pageAlert(conf));
        alert.hide().find('.dismiss').on('click', function () {
            GS.ui.dismissPageAlert(this)
        });
        $('#page_contents').prepend(alert);
        alert.slideDown(GS.cfg.anim.time);
    },
    dismissPageAlert: function (el) {
        $(el).closest('.alert').slideUp(GS.cfg.anim.time, function () {
            $(el).remove();
        });
    },
    deleteSingleFile: function (fileItem) {
        $(fileItem).trigger('file:delete', [function (id, fileTitle, error) {
            let toast = {
                type: 'success',
                message: '"' + fileTitle + '" deleted'
            };
            if (error) {
                toast.type = 'error';
                switch (error) {
                    case 'file_not_found':
                        toast.message = '"' + fileTitle + '" was not found';
                        break;
                    case 'file_deleted':
                        toast.type = 'warning';
                        toast.message = '"' + fileTitle + '" was already deleted';
                        break;
                    case 'cant_delete_file':
                        toast.message = 'You do not have the permission to delete "' + fileTitle + '"';
                        break;
                    default:
                        toast.message = 'An error occurred deleting "' + fileTitle + '"';
                }
            }
            GS.ui.showToast(toast);
        }]);
    },
    initPager: function () {
        let pageLink = GS.url.path + '?page=';
        let page = GS.paging.page;
        let right = GS.paging.pages - page;
        let left = page - 1;
        let prevPage = GS.templates.pagerLink({
            href: left ? pageLink + (page - 1) : '#',
            text: 'Prev',
            disabled: !left
        });
        let nextPage = GS.templates.pagerLink({
            href: right ? pageLink + (page + 1) : '#',
            text: 'Next',
            disabled: !right
        });
        let pageLinks = prevPage;

        pageLinks += GS.templates.pagerLink({
            href: GS.url.path,
            text: '1',
            active: page === 1
        });
        if (left > 4) {
            pageLinks += GS.templates.pagerLink({
                href: '#',
                text: '...',
                disabled: true
            });
        }
        for (let i = 2; i < GS.paging.pages; i++) {
            let dist = Math.abs(page - i);
            if (i <= page) {
                if (left <= 4 || dist <= 2 || i > GS.paging.pages - 7) {
                    pageLinks += GS.templates.pagerLink({
                        href: pageLink + i,
                        text: i,
                        active: page === i,
                    });
                }
            } else {
                if (right <= 4 || dist <= 2 || i <= 7) {
                    pageLinks += GS.templates.pagerLink({
                        href: pageLink + i,
                        text: i,
                        active: page === i,
                    });
                }
            }
        }
        if (right > 4) {
            pageLinks += GS.templates.pagerLink({
                href: '#',
                text: '...',
                disabled: true
            });
        }
        pageLinks += GS.templates.pagerLink({
            href: pageLink + GS.paging.pages,
            text: GS.paging.pages,
            active: page === GS.paging.pages
        });
        pageLinks += nextPage;
        $('.pagination-centered').removeClass('hidden').find('ul').html(pageLinks);
    },
    initTools: function () {
        $('#files_create_space_btn').after('<div id="batch_actions" class="batch_actions" style="display: none;"></div>');
        let $batchActions = $('#batch_actions');
        $batchActions.bind("DOMSubtreeModified", function () {
            if (GS.sizeOf(GS.data.selectedFiles) > 0) {
                $(this).slideDown();
            } else {
                $(this).slideUp();
            }
        });
        $batchActions.append(GS.templates.batchTools());
        $('#files_batch_delete_btn').click(GS.files.batch.deleteFiles);
        $('#files_batch_download_btn').click(GS.files.batch.downloadFiles);
        $('#files_batch_deselect_btn').click(GS.files.batch.deselectFiles);

        GS.files.batch.updateFileTools();
    },
    initFileItem: function (fileId, fileItem) {
        let file = GS.data.viewFiles[fileId];
        GS.debug.info('Initializing item:' + fileItem.attr('id'));
        if (!fileItem) {
            return "err";
        }
        if (fileItem.children('.check_overlay').length > 0) {
            return "err";
        }

        if (GS.user.id == file.user) {
            fileItem.addClass('file_owner');
        }

        let actionsEl = fileItem.find('.actions');
        fileItem.wrapInner(GS.templates.check_overlay(file.id));

        if (file.is_external) {
            actionsEl.prepend(GS.templates.actionsButton(file, {
                action: 'external',
                tag: 'a',
                icon: GS.templates.externalFileIcon(file.external_type),
                color: 'blue',
                tip: 'Open',
                href: file.url_private
            }));
        }
        if (file.can_download) {
            actionsEl.prepend(GS.templates.actionsButton(file, {
                action: 'download',
                tag: 'a',
                icon: 'ts_icon_download',
                color: 'blue',
                tip: 'Download',
                href: file.url_private_download,
                extra: 'download'
            }));
        }
        if (file.can_delete) {
            actionsEl.prepend(GS.templates.actionsButton(file, {
                action: 'delete',
                tag: 'button',
                icon: 'ts_icon_trash',
                color: 'red',
                tip: 'Delete',
            }));
        }
        actionsEl.after('<div class="actions bottom">' +
            GS.templates.actionsButton(file, {
                action: 'check',
                tag: 'div',
                icon: 'ts_icon_check_square_o',
                color: 'orange',
                color_owner: 'blue',
                tip: 'Deselected',
                tip_active: 'Selected',
                active: true,
                noborder: true,
                show_selected: true,
            }) +
            '</div>');

        fileItem.find('.filetype_image, .filetype_icon').wrap('<a href="' + file.permalink + '"></a>');

        fileItem.find('.check_overlay').click(function (event) {
            let target = $(event.target);
            if (target.is(".file_star, .star_file")) {
                return;
            }
            event.stopPropagation();
            if (target.closest('a, button').length > 0) {
                return;
            }
            let id = GS.ui.getItemFileId(this);
            let sel = GS.files.selectFile(id, 'toggle');
            GS.data.saveData();
            GS.ui.getParentFileItem(this).addClass('selecting').trigger('file:select', [sel]);
        });

        fileItem.find("button[data-action='delete']").click(function (event) {
            event.stopPropagation();
            let title = GS.ui.getItemFileTitle(this);
            let fileItem = GS.ui.getParentFileItem(this);
            if (GS.cfg.promptDelete) {
                TS.generic_dialog.start({
                    title: 'Delete file',
                    body: 'Are you sure you want to delete this file ("' + title + '") permanently?',
                    show_cancel_button: true,
                    show_go_button: true,
                    go_button_text: "Yes, delete this file",
                    go_button_class: "btn_danger",
                    cancel_button_text: "Cancel",
                    onGo: function () {
                        GS.ui.deleteSingleFile(fileItem);
                        GS.cfg.promptDelete = false;
                    }
                });
            } else {
                GS.ui.deleteSingleFile(fileItem);
            }

        });

        fileItem.on('file:select', GS.events.onSelect).on('file:remove', GS.events.onRemove).on('file:delete', GS.events.onDelete);
        if (GS.data.selectedFiles[file.id] !== undefined) {
            fileItem.trigger('file:select', ['select']);
        }
    }
};
