import {GS as GS} from './globals'

function Queue() {
    this.items = {};
    this.pushed = 0;
    this.popped = 0;
    this.accepted = 0;
    this.rejected = 0;
    this.push = function (file) {
        if (!this.items[file.id]) {
            this.items[file.id] = file;
            this.pushed++;
        }
        return this.pushed;
    };
    this.pop = function (id) {
        if (!id) {
            id = Object.keys(this.items)[0];
        }
        let item = this.items[id];
        if (this.items[id]) {
            delete this.items[id];
            this.accepted++;
            this.popped++;
        }
        return item;
    };
    this.reject = function (id) {
        if (!id) {
            id = Object.keys(this.items)[0];
        }
        let item = this.items[id];
        if (this.items[id]) {
            delete this.items[id];
            this.rejected++;
            this.popped++;
        }
        return item;
    };
    this.reset = function () {
        this.items = {};
        this.pushed = this.popped = this.rejected = this.accepted = 0;
    };
}
export default {
    filesCache: {},
    selectedFiles: {},
    selectedFilesView: {},
    viewFiles: {},
    downloadFiles: {},
    deleteFiles: {},
    delQueue: new Queue(),
    downloadQueue: new Queue(),
    getFileInfo: function (id) {
        let file = GS.data.filesCache[id];
        if (file) {
            return Promise.resolve(file);
        }
        return GS.files.info(id, function (id, file) {
            if (file) {
                GS.data.filesCache[id] = file;
            }
        });
    },
    cacheFile: function (file) {
        if (GS.data.filesCache[file.id]) {
            return;
        }
        GS.data.filesCache[id] = file;
    },
    loadFile: function (file) {
        if (!file) {
            return;
        }
        GS.data.filesCache[file.id] = file;
        GS.data.viewFiles[file.id] = file;
    },
    selectFile: function (id) {
        let file = GS.data.filesCache[id];
        if (!file) {
            return;
        }
        GS.data.selectedFiles[id] = file;
        if (GS.data.viewFiles[id]) {
            GS.data.selectedFilesView[id] = file;
        }
        if (file.can_download) {
            GS.data.downloadFiles[id] = file;
        }
        if (file.can_delete) {
            GS.data.deleteFiles[id] = file;
        }
        return file;
    },
    deselectFile: function (id) {
        delete GS.data.selectedFiles[id];
        delete GS.data.selectedFilesView[id];
        delete GS.data.downloadFiles[id];
        delete GS.data.deleteFiles[id];
    },
    deleteFile: function (id) {
        GS.data.deselectFile(id);
        delete GS.data.viewFiles[id];
        delete GS.data.filesCache[id];
        GS.paging.total--;
        GS.paging.from = GS.sizeOf(GS.data.viewFiles) > 0 ? GS.paging.from : 0;
        GS.paging.to = GS.sizeOf(GS.data.viewFiles) > 0 ? (GS.paging.from + GS.sizeOf(GS.data.viewFiles) - 1) : 0;
    },
    saveData: function () {
        localStorage.filesCache = JSON.stringify(GS.data.filesCache);
        localStorage.selectedFiles = JSON.stringify(Object.keys(GS.data.selectedFiles));
    },
    loadData: function () {
        if (localStorage.filesCache) {
            GS.data.filesCache = JSON.parse(localStorage.filesCache);
        }
        let args = {
            types: GS.url.filter,
            count: 50,
            page: GS.url.page
        };
        if (GS.url.user !== 'all') {
            args.user = TS.members.getMemberByName(GS.url.user).id;
        }
        return GS.files.list(args, function (ok, data, args) { //GS.files.search({ query: 'png', count: 50 }, function (ok, data, args) {
            data.files.forEach(function (file) {
                boot_data.files.push(file);
                GS.data.loadFile(file);
            });
            GS.paging.total = data.paging.total;
            GS.paging.pages = data.paging.pages;
            GS.paging.page = data.paging.page;
            GS.paging.per_page = Math.ceil(data.paging.total / data.paging.pages);
            GS.paging.from = (data.paging.page - 1) * GS.paging.per_page + 1;
            GS.paging.to = GS.paging.from + GS.sizeOf(GS.data.viewFiles) - 1;
            GS.debug.info('Files loaded');
        }).then(function () {
            if (localStorage.selectedFiles) {
                let selection = JSON.parse(localStorage.selectedFiles);
                let notCached = [];
                selection.forEach(function (id) {
                    if (!GS.data.selectFile(id)) {
                        notCached.push(id);
                    }
                });
                if (notCached.length) {
                    return GS.files.infoArray(notCached, function (ok, results) {
                        results.forEach(function (result) {
                            if (result.ok) {
                                let file = result.data.file;
                                GS.data.cacheFile(file);
                                GS.data.selectFile(file.id);
                            }
                        });
                        GS.debug.info('Selected file loaded');
                    });
                }
            }
            return Promise.resolve();
        }).then(function () {
            GS.data.saveData();
        });
    }
}