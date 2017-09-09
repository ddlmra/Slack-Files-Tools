import {GS as GS} from './globals'

export default {
    loadingAnim: function () {
        return '<div id="loading" class="loading_animation">' +
            '	<img src="https://a.slack-edge.com/9c217/img/loading_hash_animation_@2x.gif" srcset="https://a.slack-edge.com/9c217/img/loading_hash_animation.gif 1x, https://a.slack-edge.com/9c217/img/loading_hash_animation_@2x.gif 2x" alt="Loading" class="loading_hash"><br>loading...' +
            '	<noscript>' +
            '		You must enable javascript in order to use Slack :(' +
            '				&lt;style type="text/css"&gt;div.loading_hash { display: none; }&lt;/style&gt;' +
            '	</noscript>' +
            '</div>';
    },
    pagerLink: function (config) {
        var conf = {
            href: config.href ? config.href : '#',
            text: config.text ? config.text : '...',
            active: config.active ? config.active : false,
            disabled: config.disabled ? config.disabled : false
        };
        var style = '';
        if (conf.active) {
            style = ' class="active"';
        } else if (conf.disabled) {
            style = ' class="disabled"';
        }
        return '<li' + style + ' ><a href="' + conf.href + '">' + conf.text + '</a></li>';
    },
    check_overlay: function (id) {
        return '<div class="check_overlay" data-file-id="' + id + '"/>';
    },
    actionsButton: function (file, config) {
        if (!config) {
            return 'err';
        }
        var btnStyle = '';
        var iconStyle = '';
        var html = '';
        var conf = {
            action: config.action,
            id: config.id ? config.id : 'files_' + config.action + '_btn_' + file.id, // optional
            tag: config.tag, // 'a', 'button' or 'div'
            icon: ' ' + config.icon, // 'ts_icon_xxxx'
            color: config.color ? ' ' + config.color : '', // optional 'red', 'green', 'blue', 'orange', 'yellow'
            color_owner: config.color_owner ? ' ' + config.color_owner + '_owner' : '', // optional 'red', 'green', 'blue', 'orange', 'yellow'
            show_tip: config.show_tip !== undefined ? config.show_tip : (config.tip || config.tip_active ? true : false), // optional true, false
            tip: config.tip, // optional
            tip_active: config.tip_active, // optional
            tip_pos: config.tip_pos ? ' ts_tip_' + config.tip_pos : ' ts_tip_top', // optional 'top', 'bottom', 'left', 'right'
            href: config.href, // optional
            onclick: config.onclick ? config.onclick : '', // optional
            disabled: config.disabled, // optional true, false
            active: config.active ? ' active' : '', // optional true, false
            noborder: config.noborder ? ' noborder' : '', // optional true, false
            hide_selected: config.hide_selected ? ' hide_selected' : '', // optional true, false
            show_selected: config.show_selected ? ' show_selected' : '', // optional true, false
            extra: config.extra ? ' ' + config.extra : '', // optional extra attributes
        };
        btnStyle += 'btn_icon btn btn_outline';
        if (conf.show_tip) {
            btnStyle += ' ts_tip_btn ts_tip' + conf.tip_pos;
        }
        btnStyle += conf.noborder + conf.hide_selected + conf.show_selected + conf.active;
        iconStyle += 'action' + conf.color_owner + conf.color + ' ts_icon' + conf.icon + ' ts_icon_inherit' + conf.tip_pos + ' file_action';
        switch (conf.tag) {
            case 'a':
                conf.href = conf.href ? conf.href : 'javascript: void(0)';
                html += '<a id="' + conf.id + '" onclick="' + conf.onclick + '" data-action="' + config.action + '" data-file-id="' + file.id + '" href="' + conf.href + '" class="' + btnStyle + '"' + conf.extra + '>';
                break;
            case 'button':
                conf.disabled = conf.disabled ? 'disabled' : '';
                html += '<button id="' + conf.id + '" data-action="' + config.action + '" data-file-id="' + file.id + '" class="' + btnStyle + '"' + conf.extra + '>';
                break;
            case 'div':
                html += '<div id="' + conf.id + '" data-action="' + config.action + '" data-file-id="' + file.id + '" class="' + btnStyle + '"' + conf.extra + '>';
                break;
            default:
                return 'err';
        }
        html += '<span data-file-id="' + file.id + '" class="' + iconStyle + '"></span>';
        if (conf.show_tip && conf.tip) {
            html += '<div class="ts_tip_tip">' + conf.tip + '</div>';
        }
        if (conf.show_tip && conf.tip_active) {
            html += '<div class="ts_tip_tip tip_active">' + conf.tip_active + '</div>';
        }
        return html + '</' + conf.tag + '>';
    },
    selectAllCb: function (name) {
        return '<div style="height:1.75em"><label for="' + name + '" class="checkbox" style="margin-right: 20px;float: right;"><input class="files_select_all_cb" type="checkbox" name="' + name + '" value="1" id="' + name + '">Select all</label></div>';
    },
    batchTools: function () {
        return '<label>Batch <span style="color: #9e9ea6; font-weight: normal;">(<strong id="selected_files">' + GS.sizeOf(GS.data.selectedFiles) + '</strong> selected)</soan></label>' +
            '<div><button id="files_batch_download_btn" class="btn btn_info small_right_margin small_bottom_margin"><i class="ts_icon ts_icon_download small_right_margin"></i>Download (<span id="download_files_count">' + GS.sizeOf(GS.data.downloadFiles) + '</span>)</button>' +
            '<button id="files_batch_delete_btn" class="btn btn_danger small_bottom_margin"><i class="ts_icon ts_icon_trash small_right_margin"></i>Delete (<span id="delete_files_count">' + GS.sizeOf(GS.data.deleteFiles) + '</span>)</button></div>' +
            '<div><button id="files_batch_deselect_btn" class="btn btn_warning small_right_margin small_bottom_margin"><i class="ts_icon ts_icon_all_files small_right_margin"></i>Deselect All (<span id="deselect_files_count">' + GS.sizeOf(GS.data.selectedFiles) + '</span>)</button></div>';
    },
    batchDeleteBody: function () {
        return '<p>Are you sure you want to delete <strong>' + GS.sizeOf(GS.data.deleteFiles) + '</strong> files?</p><p>This action can not be undone</p>';
    },
    batchDownloadBody: function (totalSize) {
        return '<p>Are you sure you want to download <strong>' + GS.sizeOf(GS.data.downloadFiles) + '</strong>?</p><p>Total download size is <strong>' + totalSize + '</strong></p>';
    },
    itemOverlay: function (img) {
        if (!img) {
            img = 'https://a.slack-edge.com/9c217/img/loading_hash_animation.gif';
        }
        return '<div class="overlay">' +
            '<img src="' + img + '" alt="Loading" class="loading_hash" style="height: 40px; mix-blend-mode: multiply;"></div>';
    },
    externalFileIcon: function (type) {
        switch (type) {
            case "gdrive":
                return 'ts_icon_google_drive';
            case "dropbox":
                return 'ts_icon_dropbox';
            case "box":
                return 'ts_icon_box';
            case "onedrive":
                return 'ts_icon_windows';
            default:
                return 'ts_icon_external_link';
        }
    },
    pageAlert: function (config) {
        if (config.dismissable) {
            return '<div id="' + config.id + '" class="alert alert_' + config.type + ' dismissable"><i class="ts_icon ' + config.icon + '"></i><i class="dismiss ts_icon ts_icon_times_circle"></i>' + config.body + '</div>';
        }
        return '<div id="' + config.id + '" class="alert alert_' + config.type + '"><i class="ts_icon ' + config.icon + '"></i>' + config.body + '</div>';
    },
    progresBar: function (config) {
        var conf = {
            type: 'info',
            val: 0,
            text: '',
            id: '',
        };
        conf.type = ['info', 'success', 'warning', 'error'].indexOf(config.type) >= 0 ? config.type : conf.type;
        conf.val = config.val >= 0 ? config.val : conf.val;
        conf.text = config.text ? config.text : conf.text;
        conf.id = config.id ? config.id : conf.id;
        return '<div class="progress progress-bar-striped active"><div id="' + conf.id + '" class="progress-bar progress-bar-striped active progress-bar-' + conf.type + '" role="progressbar" style="width:' + conf.val + '%"></div><div class="progress-bar label">' + conf.text + '</div></div>';
    }
}