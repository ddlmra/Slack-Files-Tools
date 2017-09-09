import {GS as GS} from './globals'
import batch from './files-batch';

export default {
    upsertFile: function (file) {
        TS.files.upsertFile(file);
        file.can_download = !file.is_external;
        file.can_delete = (GS.user.admin || GS.user.id === file.user);
    },
    list: function (args, callback) {
        return TS.api.call('files.list', args).then(function (resp) {
            resp.data.files.forEach(function (file) {
                GS.files.upsertFile(file);
            });
            if (typeof callback === "function") {
                callback(resp.data.ok, {files: resp.data.files, paging: resp.data.paging, ok: resp.data.ok}, resp.args);
            }
            return resp;
        }).catch(function (resp) {
            if (typeof callback === "function") {
                callback(false, resp.data, resp.args);
            }
            return resp;
        });
    },
    search: function (args, callback) {
        return TS.api.call('search.files', args).then(function (resp) {
            resp.data.files.matches.forEach(function (file) {
                GS.files.upsertFile(file);
            });
            if (typeof callback === "function") {
                callback(resp.data.ok, {files: resp.data.files.matches, paging: resp.data.files.paging, ok: resp.data.ok, query: resp.data.query}, resp.args);
            }
            return resp;
        }).catch(function (resp) {
            if (typeof callback === "function") {
                callback(false, resp.data, resp.args);
            }
            return resp;
        });
    },
    infoArray: function (files, callback) {
        let result = {ok: false, results: [], array: files};
        GS.debug.info('Files: ', files);

        if (Array.isArray(files)) {
            return Promise.all(files.map(function (item, i, arr) {
                GS.debug.info('File: ', item);
                if (item === undefined) {
                    return Promise.resolve('undefined');
                }
                return GS.files.info(item).then(function (resp) {
                    result.results.push({ok: true, index: i, item: item, data: resp.data});
                    return resp;
                }).catch(function (resp) {
                    result.results.push({ok: false, index: i, item: item, data: resp});
                    return resp;
                });
            }, Promise.resolve()))
                .then(function () {
                    if (result.error.length > 0) {
                        result.ok = false;
                        return Promise.reject(result);
                    }
                    result.ok = true;
                    if (typeof callback === "function") {
                        callback(result.ok, result.results);
                        return result;
                    }
                    return Promise.resolve(result);
                }).catch(function () {
                    result.ok = false;
                    if (typeof callback === "function") {
                        callback(result.ok, result.results);
                    }
                    return result;
                });
        }
        throw 'files must be an array';
    },
    info: function (id, callback) {
        GS.debug.info('Fetching "' + id + '"');
        return TS.api.call('files.info', {file: id})
            .then(function (resp) {
                let file = resp.data.file;
                GS.debug.info('File "' + id + '" fetched');
                GS.files.upsertFile(file);
                if (typeof callback === "function") {
                    callback(id, file);
                }
                return resp;
            })
            .catch(function (resp) {
                TS.error('Error "' + resp.data.error + '" retrieving info for file "' + id + '"');
                if (typeof callback === "function") {
                    callback(id);
                }
                return resp;
            });
    },
    extractFileInfo: function (files, props) {
        let extracted = [];
        for (let id in files) {
            let file = files[id];
            let item = [id];
            props.forEach(function (key) {
                if (file[key] !== undefined) {
                    item.push(typeof file[key] === 'boolean' ? (file[key] ? 1 : 0) : file[key]);
                }
            });
            extracted.push(item);
        }
        return extracted;
    },
    deleteFile: function (id, callback) {
        if (GS.cfg.simulation) {
            return setTimeout(function () {
                GS.debug.info('File "' + id + '" deleted');
                if (typeof callback === 'function') {
                    let error;
                    if (!Math.round(Math.random() * 10)) {
                        error = 'test-error';
                    }
                    callback(id, error);
                }
            }, Math.floor((Math.random() * 5000) + 1));
        } else {
            return TS.api.call('files.delete', {file: id}).then(function (resp) {
                callback(id);
            }).catch(function (resp) {
                callback(id, resp.data.error);
            });
        }
    },
    selectFile: function (id, selection) {
        switch (selection) {
            case 'select':
                if (GS.data.selectedFiles[id] !== undefined) return;
                if (GS.sizeOf(GS.data.selectedFiles) >= GS.cfg.maxSelect) {
                    GS.ui.showToast({
                        type: 'warning',
                        message: 'Max selection ' + GS.cfg.maxSelect + ' files'
                    });
                    return 'full';
                }
                GS.data.selectFile(id);
                break;
            case 'deselect':
                if (GS.data.selectedFiles[id] === undefined) return;
                GS.data.deselectFile(id);
                break;
            default:
                if (GS.data.selectedFiles[id] === undefined) {
                    return GS.files.selectFile(id, 'select');
                } else {
                    return GS.files.selectFile(id, 'deselect');
                }
        }
        GS.files.batch.updateFileTools();
        return selection;
    },
    batch: batch
};
