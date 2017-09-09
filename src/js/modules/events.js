import {GS as GS} from './globals'

export default {
    onSelect: function (event, selection) {
        GS.ui.activateFileItem(this, selection);
    },
    onDelete: function (event, callback) {
        let id = GS.ui.getItemFileId(this);
        let fileTitle = GS.ui.getItemFileTitle(this);
        $(this).addClass('deleting').append(GS.templates.itemOverlay());

        GS.files.deleteFile(id, function (id, error) {
            if (error) {
                GS.ui.getFileItem(id).removeClass('deleting').find('.overlay').remove();
                GS.ui.shakeAnim(GS.ui.getFileItem(id));
            } else {
                GS.ui.getFileItem(id).trigger('file:remove');
                GS.data.deleteFile(id);
                GS.files.batch.updateFileTools();
            }
            if (typeof callback === 'function') {
                callback(id, fileTitle, error);
            }
            GS.data.saveData();
        });
    },
    onRemove: function (event) {
        $(this).addClass('removing');
        GS.ui.removeAnim(this);
    },
};
