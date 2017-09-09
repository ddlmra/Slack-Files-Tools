// ==UserScript==
// @name         Slack Files Tools
// @version      1.0.0
// @description  Extends Slack files webpage functionalities
// @author       Mauro
// @license      MIT
// @namespace    https://github.com/gusuraman
// @match        https://*.slack.com/files*
// @grant        none
// @run-at       document-end
// @icon         https://github.com/fluidicon.png
// @updateURL    https://raw.githubusercontent.com/gusuraman/slack-files-tools/master/dist/slack.files_tools.js
// @downloadURL  https://raw.githubusercontent.com/gusuraman/slack-files-tools/master/dist/slack.files_tools.js
// ==/UserScript==
(function () { "use strict";
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var GS = exports.GS = {};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2);
module.exports = __webpack_require__(11);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _globals = __webpack_require__(0);

var _config = __webpack_require__(3);

var _config2 = _interopRequireDefault(_config);

var _data = __webpack_require__(4);

var _data2 = _interopRequireDefault(_data);

var _utilities = __webpack_require__(5);

var __utils = _interopRequireWildcard(_utilities);

var _files = __webpack_require__(6);

var _files2 = _interopRequireDefault(_files);

var _events = __webpack_require__(8);

var _events2 = _interopRequireDefault(_events);

var _templates = __webpack_require__(9);

var _templates2 = _interopRequireDefault(_templates);

var _ui = __webpack_require__(10);

var _ui2 = _interopRequireDefault(_ui);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

boot_data.files = [];
_globals.GS.cfg = _config2.default;

loadUtils();
parseUrl();
initGlobals();
loadRes();
// GS.loadStyle(GS.cfg.styles);

_globals.GS.debug.info(_globals.GS.cfg);

$('.pagination-centered').addClass('hidden');
var viewSummary = $('.span_1_of_3>p.subtle_silver').addClass('hidden');

if ($('#files_div').length) {
    $(".loading_hash_animation").on("remove", function () {
        $('#files_list').hide().before(_globals.GS.templates.loadingAnim());
        _globals.GS.data.loadData().then(finalizeBoot);
    });
} else {
    $('#files_owner').bind("DOMSubtreeModified", function () {
        $(this).unbind("DOMSubtreeModified");
        _globals.GS.data.loadData().then(_globals.GS.ui.initTools);
    });
}

function finalizeBoot() {
    _globals.GS.debug.info('Boot complete');
    var $filesList = $('#files_list');
    $filesList.removeClass('loaded');

    viewSummary.find('strong:nth-child(1)').attr('id', 'view_files_from');
    viewSummary.find('strong:nth-child(2)').attr('id', 'view_files_to');
    viewSummary.find('strong:nth-child(3)').attr('id', 'view_files_total');

    TS.web.files.renderFiles(boot_data.files);

    _globals.GS.debug.info('Files rendered');
    _globals.GS.ui.initTools();
    $filesList.before(_globals.GS.templates.selectAllCb('files_select_all_top'));
    $filesList.after(_globals.GS.templates.selectAllCb('files_select_all_bottom'));
    $('.files_select_all_cb').click(_globals.GS.files.batch.selectAllCb);

    _globals.GS.files.batch.updateFileTools();
    $('.span_1_of_3>p.subtle_silver').removeClass('hidden');
    if (_globals.GS.paging.pages > 1) {
        _globals.GS.ui.initPager();
    }
    _globals.GS.debug.info('Initializing files items');
    var listItems = $('.file_list_item');
    listItems.each(function () {
        _globals.GS.ui.initFileItem(_globals.GS.ui.getItemFileId(this), $(this));
    });
    $('#loading').remove();
    $filesList.slideDown(1000);
}

function loadRes() {
    _globals.GS.templates = _templates2.default;
    _globals.GS.files = _files2.default;
    _globals.GS.events = _events2.default;
    _globals.GS.ui = _ui2.default;
}

function initGlobals() {
    _globals.GS.user = {
        id: boot_data.user_id,
        username: $('#user_menu_name').text(),
        team: $('script:contains(TS.clog.setTeam)').text().replace(/(?:.|[\r\n])*?TS\.clog\.setTeam\('(T[A-Z0-9]+)(?:.|[\r\n])*/, '$1'),
        admin: !!$('#admin_nav').length
    };
    _globals.GS.paging = {
        from: 0,
        to: 0,
        total: 0,
        page: 0,
        pages: 0,
        per_page: 0
    };
    _globals.GS.data = _data2.default;
}

function loadUtils() {
    _globals.GS.debug = __utils.debug;
    _globals.GS.sizeOf = __utils.sizeOf;
    _globals.GS.loadStyle = __utils.loadStyle;
}

function parseUrl() {
    var urlHash = location.hash.slice(1);
    var urlPath = location.pathname.split('/');
    _globals.GS.url = {
        protocol: location.protocol,
        team: location.protocol + '//' + location.host,
        path: location.pathname,
        user: urlPath[2] ? urlPath[2] : 'all',
        page: location.search ? parseInt(location.search.replace(/.*?page=([0-9]+).*/, '$1'), 10) : 1,
        filter: 'all'
    };
    if (urlPath[3]) {
        location.hash = '';
        _globals.GS.url.filter = urlPath[3];
        _globals.GS.url.search = false;
    }
    /*slack search works differently than expected
           else {
               switch (urlHash) {
                   case 'videos':
                       GS.url.filter = '3g2 3gp asf avi dif flv m4u m4v mkv mov mp4 mpg mpe mpeg mxu qt swf vob wmv';
                       GS.url.search = true;
                       break;
                   case 'audios':
                       GS.url.filter = 'au snd kar mid midi m4a m4b m4p mp2 mp3 mpga aif aifc aiff m3u ra ram wav';
                       GS.url.search = true;
                       break;
                   default:
                       GS.url.filter = 'all';
               }
           }*/
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//import style from '../css/slack.files_extension.scss'

exports.default = {
    env: "production",
    debug: "production" === 'development',
    simulation: "production" === 'development',
    promptDelete: true,
    anim: {
        delay: 40,
        time: 200
    },
    maxSelect: 200
    //styles: [style]
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _globals = __webpack_require__(0);

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
        var item = this.items[id];
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
        var item = this.items[id];
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
exports.default = {
    filesCache: {},
    selectedFiles: {},
    selectedFilesView: {},
    viewFiles: {},
    downloadFiles: {},
    deleteFiles: {},
    delQueue: new Queue(),
    downloadQueue: new Queue(),
    getFileInfo: function getFileInfo(id) {
        var file = _globals.GS.data.filesCache[id];
        if (file) {
            return Promise.resolve(file);
        }
        return _globals.GS.files.info(id, function (id, file) {
            if (file) {
                _globals.GS.data.filesCache[id] = file;
            }
        });
    },
    cacheFile: function cacheFile(file) {
        if (_globals.GS.data.filesCache[file.id]) {
            return;
        }
        _globals.GS.data.filesCache[id] = file;
    },
    loadFile: function loadFile(file) {
        if (!file) {
            return;
        }
        _globals.GS.data.filesCache[file.id] = file;
        _globals.GS.data.viewFiles[file.id] = file;
    },
    selectFile: function selectFile(id) {
        var file = _globals.GS.data.filesCache[id];
        if (!file) {
            return;
        }
        _globals.GS.data.selectedFiles[id] = file;
        if (_globals.GS.data.viewFiles[id]) {
            _globals.GS.data.selectedFilesView[id] = file;
        }
        if (file.can_download) {
            _globals.GS.data.downloadFiles[id] = file;
        }
        if (file.can_delete) {
            _globals.GS.data.deleteFiles[id] = file;
        }
        return file;
    },
    deselectFile: function deselectFile(id) {
        delete _globals.GS.data.selectedFiles[id];
        delete _globals.GS.data.selectedFilesView[id];
        delete _globals.GS.data.downloadFiles[id];
        delete _globals.GS.data.deleteFiles[id];
    },
    deleteFile: function deleteFile(id) {
        _globals.GS.data.deselectFile(id);
        delete _globals.GS.data.viewFiles[id];
        delete _globals.GS.data.filesCache[id];
        _globals.GS.paging.total--;
        _globals.GS.paging.from = _globals.GS.sizeOf(_globals.GS.data.viewFiles) > 0 ? _globals.GS.paging.from : 0;
        _globals.GS.paging.to = _globals.GS.sizeOf(_globals.GS.data.viewFiles) > 0 ? _globals.GS.paging.from + _globals.GS.sizeOf(_globals.GS.data.viewFiles) - 1 : 0;
    },
    saveData: function saveData() {
        localStorage.filesCache = JSON.stringify(_globals.GS.data.filesCache);
        localStorage.selectedFiles = JSON.stringify(Object.keys(_globals.GS.data.selectedFiles));
    },
    loadData: function loadData() {
        if (localStorage.filesCache) {
            _globals.GS.data.filesCache = JSON.parse(localStorage.filesCache);
        }
        var args = {
            types: _globals.GS.url.filter,
            count: 50,
            page: _globals.GS.url.page
        };
        if (_globals.GS.url.user !== 'all') {
            args.user = TS.members.getMemberByName(_globals.GS.url.user).id;
        }
        return _globals.GS.files.list(args, function (ok, data, args) {
            //GS.files.search({ query: 'png', count: 50 }, function (ok, data, args) {
            data.files.forEach(function (file) {
                boot_data.files.push(file);
                _globals.GS.data.loadFile(file);
            });
            _globals.GS.paging.total = data.paging.total;
            _globals.GS.paging.pages = data.paging.pages;
            _globals.GS.paging.page = data.paging.page;
            _globals.GS.paging.per_page = Math.ceil(data.paging.total / data.paging.pages);
            _globals.GS.paging.from = (data.paging.page - 1) * _globals.GS.paging.per_page + 1;
            _globals.GS.paging.to = _globals.GS.paging.from + _globals.GS.sizeOf(_globals.GS.data.viewFiles) - 1;
            _globals.GS.debug.info('Files loaded');
        }).then(function () {
            if (localStorage.selectedFiles) {
                var selection = JSON.parse(localStorage.selectedFiles);
                var notCached = [];
                selection.forEach(function (id) {
                    if (!_globals.GS.data.selectFile(id)) {
                        notCached.push(id);
                    }
                });
                if (notCached.length) {
                    return _globals.GS.files.infoArray(notCached, function (ok, results) {
                        results.forEach(function (result) {
                            if (result.ok) {
                                var file = result.data.file;
                                _globals.GS.data.cacheFile(file);
                                _globals.GS.data.selectFile(file.id);
                            }
                        });
                        _globals.GS.debug.info('Selected file loaded');
                    });
                }
            }
            return Promise.resolve();
        }).then(function () {
            _globals.GS.data.saveData();
        });
    }
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.debug = undefined;
exports.sizeOf = sizeOf;
exports.loadStyle = loadStyle;

var _globals = __webpack_require__(0);

var debug = exports.debug = {
    logMessage: function logMessage() {
        if (!_globals.GS.cfg.debug || arguments.length < 2) return;

        var type = arguments[0];
        var newArgs = Array.prototype.slice.call(arguments, 1);
        switch (type) {
            case 'error':
                TS.error.apply(this, newArgs);
                break;
            case 'info':
                TS.info.apply(this, newArgs);
                break;
            case 'warn':
                TS.warn.apply(this, newArgs);
                break;
            case 'log':
                console.log.apply(this, newArgs);
                break;
            default:
                return;
        }
    },
    info: function info() {
        if (arguments.length > 0) {
            _globals.GS.debug.logMessage.apply(this, ['info'].concat(Array.prototype.slice.call(arguments)));
        }
    },
    error: function error() {
        if (arguments.length > 0) {
            _globals.GS.debug.logMessage.apply(this, ['error'].concat(Array.prototype.slice.call(arguments)));
        }
    },
    warn: function warn() {
        if (arguments.length > 0) {
            _globals.GS.debug.logMessage.apply(this, ['warn'].concat(Array.prototype.slice.call(arguments)));
        }
    },
    log: function log() {
        if (arguments.length > 0) {
            _globals.GS.debug.logMessage.apply(this, ['log'].concat(Array.prototype.slice.call(arguments)));
        }
    }
};

function sizeOf(obj) {
    if ($.isFunction(Object.keys)) {
        return Object.keys(obj).length;
    }
    var size = 0;
    for (var key in obj) {
        size++;
    }
    return size;
}

function loadStyle(styles) {
    if (Array.isArray(styles)) {
        styles.forEach(function (stylesheet) {
            if (stylesheet.search('http') === 0) {
                $('head').append('<link rel="stylesheet" type="text/css" media="all" href="' + stylesheet + '">');
            } else {
                $('head').append('<style>' + stylesheet + '</style>');
            }
        });
        return;
    }
    if (styles.search('http') === 0) {
        $('head').append('<link rel="stylesheet" type="text/css" media="all" href="' + styles + '">');
    } else {
        $('head').append('<style>' + styles + '</style>');
    }
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _globals = __webpack_require__(0);

var _filesBatch = __webpack_require__(7);

var _filesBatch2 = _interopRequireDefault(_filesBatch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    upsertFile: function upsertFile(file) {
        TS.files.upsertFile(file);
        file.can_download = !file.is_external;
        file.can_delete = _globals.GS.user.admin || _globals.GS.user.id === file.user;
    },
    list: function list(args, callback) {
        return TS.api.call('files.list', args).then(function (resp) {
            resp.data.files.forEach(function (file) {
                _globals.GS.files.upsertFile(file);
            });
            if (typeof callback === "function") {
                callback(resp.data.ok, { files: resp.data.files, paging: resp.data.paging, ok: resp.data.ok }, resp.args);
            }
            return resp;
        }).catch(function (resp) {
            if (typeof callback === "function") {
                callback(false, resp.data, resp.args);
            }
            return resp;
        });
    },
    search: function search(args, callback) {
        return TS.api.call('search.files', args).then(function (resp) {
            resp.data.files.matches.forEach(function (file) {
                _globals.GS.files.upsertFile(file);
            });
            if (typeof callback === "function") {
                callback(resp.data.ok, { files: resp.data.files.matches, paging: resp.data.files.paging, ok: resp.data.ok, query: resp.data.query }, resp.args);
            }
            return resp;
        }).catch(function (resp) {
            if (typeof callback === "function") {
                callback(false, resp.data, resp.args);
            }
            return resp;
        });
    },
    infoArray: function infoArray(files, callback) {
        var result = { ok: false, results: [], array: files };
        _globals.GS.debug.info('Files: ', files);

        if (Array.isArray(files)) {
            return Promise.all(files.map(function (item, i, arr) {
                _globals.GS.debug.info('File: ', item);
                if (item === undefined) {
                    return Promise.resolve('undefined');
                }
                return _globals.GS.files.info(item).then(function (resp) {
                    result.results.push({ ok: true, index: i, item: item, data: resp.data });
                    return resp;
                }).catch(function (resp) {
                    result.results.push({ ok: false, index: i, item: item, data: resp });
                    return resp;
                });
            }, Promise.resolve())).then(function () {
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
    info: function info(id, callback) {
        _globals.GS.debug.info('Fetching "' + id + '"');
        return TS.api.call('files.info', { file: id }).then(function (resp) {
            var file = resp.data.file;
            _globals.GS.debug.info('File "' + id + '" fetched');
            _globals.GS.files.upsertFile(file);
            if (typeof callback === "function") {
                callback(id, file);
            }
            return resp;
        }).catch(function (resp) {
            TS.error('Error "' + resp.data.error + '" retrieving info for file "' + id + '"');
            if (typeof callback === "function") {
                callback(id);
            }
            return resp;
        });
    },
    extractFileInfo: function extractFileInfo(files, props) {
        var extracted = [];

        var _loop = function _loop(id) {
            var file = files[id];
            var item = [id];
            props.forEach(function (key) {
                if (file[key] !== undefined) {
                    item.push(typeof file[key] === 'boolean' ? file[key] ? 1 : 0 : file[key]);
                }
            });
            extracted.push(item);
        };

        for (var id in files) {
            _loop(id);
        }
        return extracted;
    },
    deleteFile: function deleteFile(id, callback) {
        if (_globals.GS.cfg.simulation) {
            return setTimeout(function () {
                _globals.GS.debug.info('File "' + id + '" deleted');
                if (typeof callback === 'function') {
                    var error = void 0;
                    if (!Math.round(Math.random() * 10)) {
                        error = 'test-error';
                    }
                    callback(id, error);
                }
            }, Math.floor(Math.random() * 5000 + 1));
        } else {
            return TS.api.call('files.delete', { file: id }).then(function (resp) {
                callback(id);
            }).catch(function (resp) {
                callback(id, resp.data.error);
            });
        }
    },
    selectFile: function selectFile(id, selection) {
        switch (selection) {
            case 'select':
                if (_globals.GS.data.selectedFiles[id] !== undefined) return;
                if (_globals.GS.sizeOf(_globals.GS.data.selectedFiles) >= _globals.GS.cfg.maxSelect) {
                    _globals.GS.ui.showToast({
                        type: 'warning',
                        message: 'Max selection ' + _globals.GS.cfg.maxSelect + ' files'
                    });
                    return 'full';
                }
                _globals.GS.data.selectFile(id);
                break;
            case 'deselect':
                if (_globals.GS.data.selectedFiles[id] === undefined) return;
                _globals.GS.data.deselectFile(id);
                break;
            default:
                if (_globals.GS.data.selectedFiles[id] === undefined) {
                    return _globals.GS.files.selectFile(id, 'select');
                } else {
                    return _globals.GS.files.selectFile(id, 'deselect');
                }
        }
        _globals.GS.files.batch.updateFileTools();
        return selection;
    },
    batch: _filesBatch2.default
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _globals = __webpack_require__(0);

exports.default = {
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
    deleteFiles: function deleteFiles() {
        TS.generic_dialog.start({
            title: 'Delete selected files',
            body: _globals.GS.templates.batchDeleteBody(),
            show_cancel_button: true,
            show_go_button: true,
            go_button_text: "Yes, delete these files",
            go_button_class: "btn_danger",
            cancel_button_text: "Cancel",
            onGo: function onGo() {
                for (var id in _globals.GS.data.selectedFiles) {
                    if (_globals.GS.data.selectedFiles[id].can_delete) {
                        _globals.GS.data.delQueue.push(_globals.GS.data.selectedFiles[id]);
                        if (_globals.GS.data.viewFiles[id]) {
                            $(_globals.GS.ui.getFileItem(id)).trigger('file:delete', [function (id, fileTitle, error) {
                                if (error) {
                                    _globals.GS.data.delQueue.reject(id);
                                } else {
                                    _globals.GS.data.delQueue.pop(id);
                                }
                                $('#delete_progress').trigger('progress:update');
                            }]);
                        } else {
                            _globals.GS.files.deleteFile(id, function (id, error) {
                                if (error) {
                                    _globals.GS.data.delQueue.reject(id);
                                } else {
                                    _globals.GS.data.delQueue.pop(id);
                                    _globals.GS.data.deleteFile(id);
                                }
                                _globals.GS.files.batch.updateFileTools();
                                $('#delete_progress').trigger('progress:update');
                                _globals.GS.data.saveData();
                            });
                        }
                    }
                }
                _globals.GS.files.batch.deleteProgress();
            }
        });
    },
    deleteProgress: function deleteProgress() {
        var title = 'Deleting Files';
        var txt = _globals.GS.templates.progresBar({
            id: 'delete_progress',
            text: _globals.GS.data.delQueue.popped + '/' + _globals.GS.data.delQueue.pushed + ' files deleted',
            type: 'success',
            val: 0
        });
        _globals.GS.ui.showPageAlert({
            body: txt,
            dismissable: false,
            type: 'info',
            id: 'delete_progress_alert'
        });
        $('#delete_progress').on('progress:update', function (event) {
            var percent = _globals.GS.data.delQueue.popped / _globals.GS.data.delQueue.pushed * 100;
            if (_globals.GS.data.delQueue.rejected > 0) {
                $(this).addClass('progress-bar-warning');
            }
            $(this).width(percent + '%').next().html(_globals.GS.data.delQueue.popped + '/' + _globals.GS.data.delQueue.pushed + ' files deleted');
            if (_globals.GS.data.delQueue.popped >= _globals.GS.data.delQueue.pushed) {
                _globals.GS.ui.dismissPageAlert($('#delete_progress_alert'));
                var toats = {
                    type: 'success',
                    message: _globals.GS.data.delQueue.popped + ' files deleted'
                };
                var alert = {
                    body: toats.message,
                    dismissable: true,
                    type: 'success',
                    id: 'delete_complete_alert'
                };
                if (_globals.GS.data.delQueue.rejected) {
                    toats = {
                        type: 'warning',
                        message: _globals.GS.data.delQueue.accepted + ' files deleted - ' + _globals.GS.data.delQueue.rejected + ' files failed'
                    };
                    alert.body = toats.message;
                    alert.type = toats.type;
                }
                _globals.GS.ui.showPageAlert(alert);
                _globals.GS.ui.showToast(toats);
                _globals.GS.data.delQueue.reset();
            }
        });
    },
    downloadFiles: function downloadFiles() {
        var totalBytes = 0;
        var totalSize = '';
        for (var id in _globals.GS.data.downloadFiles) {
            totalBytes += _globals.GS.data.downloadFiles[id].size;
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
            body: _globals.GS.templates.batchDownloadBody(totalSize),
            show_cancel_button: true,
            show_go_button: true,
            go_button_text: "Yes, download these files",
            cancel_button_text: "Cancel",
            onGo: function onGo() {
                $('body').append('<div id="download_queue" style="display:none">');
                var $downloadQueue = $('#download_queue');
                for (var _id in _globals.GS.data.downloadFiles) {
                    $downloadQueue.append('<a href="' + _globals.GS.data.downloadFiles[_id].url_private_download + '" download>');
                }
                $('#download_queue').find('a').each(function (el) {
                    $(this)[0].click();
                });
                $downloadQueue.remove();
            }
        });
    },
    deselectFiles: function deselectFiles() {
        for (var id in _globals.GS.data.selectedFiles) {
            _globals.GS.files.selectFile(id, 'deselect');
        }
        _globals.GS.data.saveData();
        var i = 0;
        var elements = $($('.file_list_item.file_item_selected').get().reverse());
        elements.each(function (index, el) {
            var id = _globals.GS.ui.getItemFileId(el);
            if (_globals.GS.ui.isVisible(el)) {
                setTimeout(function () {
                    $(el).trigger('file:select', ['deselect']);
                }, _globals.GS.cfg.anim.delay * i++);
            } else {
                $(el).trigger('file:select', ['deselect']);
            }
        });
    },
    selectAllCb: function selectAllCb(event) {
        var checked = $(this).is(":checked");
        var i = 0;
        var elements = checked ? $('.file_item:not(.file_item_selected)') : $($('.file_item.file_item_selected').get().reverse());
        elements.each(function (index, el) {
            var sel = _globals.GS.files.selectFile(_globals.GS.ui.getItemFileId(el), 'toggle');
            if (sel === 'full') {
                return false;
            }
            if (_globals.GS.ui.isVisible(el)) {
                setTimeout(function () {
                    $(el).trigger('file:select', [sel]);
                }, _globals.GS.cfg.anim.delay * i++);
            } else {
                $(el).trigger('file:select', [sel]);
            }
        });
        $('.files_select_all_cb').prop('checked', checked);
        _globals.GS.data.saveData();
    },
    updateFileTools: function updateFileTools() {
        $('#selected_files').text(_globals.GS.sizeOf(_globals.GS.data.selectedFiles));
        $('#download_files_count').text(_globals.GS.sizeOf(_globals.GS.data.downloadFiles));
        $('#delete_files_count').text(_globals.GS.sizeOf(_globals.GS.data.deleteFiles));
        $('#deselect_files_count').text(_globals.GS.sizeOf(_globals.GS.data.selectedFiles));
        $('#files_batch_download_btn').attr('disabled', _globals.GS.sizeOf(_globals.GS.data.downloadFiles) === 0);
        $('#files_batch_delete_btn').attr('disabled', _globals.GS.sizeOf(_globals.GS.data.deleteFiles) === 0);
        $('#files_batch_deselect_btn').attr('disabled', _globals.GS.sizeOf(_globals.GS.data.selectedFiles) === 0);

        if (_globals.GS.sizeOf(_globals.GS.data.selectedFilesView) == _globals.GS.sizeOf(_globals.GS.data.viewFiles)) {
            $('.files_select_all_cb').prop('checked', true);
        } else {
            $('.files_select_all_cb').prop('checked', false);
        }

        $('#view_files_from').text(_globals.GS.paging.from);
        $('#view_files_to').text(_globals.GS.paging.to);
        $('#view_files_total').text(_globals.GS.paging.total);
    }
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _globals = __webpack_require__(0);

exports.default = {
    onSelect: function onSelect(event, selection) {
        _globals.GS.ui.activateFileItem(this, selection);
    },
    onDelete: function onDelete(event, callback) {
        var id = _globals.GS.ui.getItemFileId(this);
        var fileTitle = _globals.GS.ui.getItemFileTitle(this);
        $(this).addClass('deleting').append(_globals.GS.templates.itemOverlay());

        _globals.GS.files.deleteFile(id, function (id, error) {
            if (error) {
                _globals.GS.ui.getFileItem(id).removeClass('deleting').find('.overlay').remove();
                _globals.GS.ui.shakeAnim(_globals.GS.ui.getFileItem(id));
            } else {
                _globals.GS.ui.getFileItem(id).trigger('file:remove');
                _globals.GS.data.deleteFile(id);
                _globals.GS.files.batch.updateFileTools();
            }
            if (typeof callback === 'function') {
                callback(id, fileTitle, error);
            }
            _globals.GS.data.saveData();
        });
    },
    onRemove: function onRemove(event) {
        $(this).addClass('removing');
        _globals.GS.ui.removeAnim(this);
    }
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _globals = __webpack_require__(0);

exports.default = {
    loadingAnim: function loadingAnim() {
        return '<div id="loading" class="loading_animation">' + '	<img src="https://a.slack-edge.com/9c217/img/loading_hash_animation_@2x.gif" srcset="https://a.slack-edge.com/9c217/img/loading_hash_animation.gif 1x, https://a.slack-edge.com/9c217/img/loading_hash_animation_@2x.gif 2x" alt="Loading" class="loading_hash"><br>loading...' + '	<noscript>' + '		You must enable javascript in order to use Slack :(' + '				&lt;style type="text/css"&gt;div.loading_hash { display: none; }&lt;/style&gt;' + '	</noscript>' + '</div>';
    },
    pagerLink: function pagerLink(config) {
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
    check_overlay: function check_overlay(id) {
        return '<div class="check_overlay" data-file-id="' + id + '"/>';
    },
    actionsButton: function actionsButton(file, config) {
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
            show_tip: config.show_tip !== undefined ? config.show_tip : config.tip || config.tip_active ? true : false, // optional true, false
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
            extra: config.extra ? ' ' + config.extra : '' // optional extra attributes
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
    selectAllCb: function selectAllCb(name) {
        return '<div style="height:1.75em"><label for="' + name + '" class="checkbox" style="margin-right: 20px;float: right;"><input class="files_select_all_cb" type="checkbox" name="' + name + '" value="1" id="' + name + '">Select all</label></div>';
    },
    batchTools: function batchTools() {
        return '<label>Batch <span style="color: #9e9ea6; font-weight: normal;">(<strong id="selected_files">' + _globals.GS.sizeOf(_globals.GS.data.selectedFiles) + '</strong> selected)</soan></label>' + '<div><button id="files_batch_download_btn" class="btn btn_info small_right_margin small_bottom_margin"><i class="ts_icon ts_icon_download small_right_margin"></i>Download (<span id="download_files_count">' + _globals.GS.sizeOf(_globals.GS.data.downloadFiles) + '</span>)</button>' + '<button id="files_batch_delete_btn" class="btn btn_danger small_bottom_margin"><i class="ts_icon ts_icon_trash small_right_margin"></i>Delete (<span id="delete_files_count">' + _globals.GS.sizeOf(_globals.GS.data.deleteFiles) + '</span>)</button></div>' + '<div><button id="files_batch_deselect_btn" class="btn btn_warning small_right_margin small_bottom_margin"><i class="ts_icon ts_icon_all_files small_right_margin"></i>Deselect All (<span id="deselect_files_count">' + _globals.GS.sizeOf(_globals.GS.data.selectedFiles) + '</span>)</button></div>';
    },
    batchDeleteBody: function batchDeleteBody() {
        return '<p>Are you sure you want to delete <strong>' + _globals.GS.sizeOf(_globals.GS.data.deleteFiles) + '</strong> files?</p><p>This action can not be undone</p>';
    },
    batchDownloadBody: function batchDownloadBody(totalSize) {
        return '<p>Are you sure you want to download <strong>' + _globals.GS.sizeOf(_globals.GS.data.downloadFiles) + '</strong>?</p><p>Total download size is <strong>' + totalSize + '</strong></p>';
    },
    itemOverlay: function itemOverlay(img) {
        if (!img) {
            img = 'https://a.slack-edge.com/9c217/img/loading_hash_animation.gif';
        }
        return '<div class="overlay">' + '<img src="' + img + '" alt="Loading" class="loading_hash" style="height: 40px; mix-blend-mode: multiply;"></div>';
    },
    externalFileIcon: function externalFileIcon(type) {
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
    pageAlert: function pageAlert(config) {
        if (config.dismissable) {
            return '<div id="' + config.id + '" class="alert alert_' + config.type + ' dismissable"><i class="ts_icon ' + config.icon + '"></i><i class="dismiss ts_icon ts_icon_times_circle"></i>' + config.body + '</div>';
        }
        return '<div id="' + config.id + '" class="alert alert_' + config.type + '"><i class="ts_icon ' + config.icon + '"></i>' + config.body + '</div>';
    },
    progresBar: function progresBar(config) {
        var conf = {
            type: 'info',
            val: 0,
            text: '',
            id: ''
        };
        conf.type = ['info', 'success', 'warning', 'error'].indexOf(config.type) >= 0 ? config.type : conf.type;
        conf.val = config.val >= 0 ? config.val : conf.val;
        conf.text = config.text ? config.text : conf.text;
        conf.id = config.id ? config.id : conf.id;
        return '<div class="progress progress-bar-striped active"><div id="' + conf.id + '" class="progress-bar progress-bar-striped active progress-bar-' + conf.type + '" role="progressbar" style="width:' + conf.val + '%"></div><div class="progress-bar label">' + conf.text + '</div></div>';
    }
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _globals = __webpack_require__(0);

exports.default = {
    getFileItem: function getFileItem(selector) {
        if ($(selector).length > 0) {
            return _globals.GS.ui.getParentFileItem(selector);
        }
        return $('#file_' + selector);
    },
    getParentFileItem: function getParentFileItem(child) {
        return $(child).closest('.file_list_item');
    },
    getItemFileId: function getItemFileId(item) {
        var id = $(item).data('file-id');
        if (id === undefined) {
            id = _globals.GS.ui.getParentFileItem(item).data('file-id');
        }
        return id;
    },
    getItemFileTitle: function getItemFileTitle(item) {
        return _globals.GS.ui.getParentFileItem(item).find('.title a').text().replace(/(?:\s|[\r\n])*(.+)[\r\n]*.*/, '$1');
    },
    isVisible: function isVisible(fileItem) {
        var el = $(fileItem);
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = el.offset().top;
        var elemBottom = elemTop + el.height();
        return elemTop <= docViewBottom && elemBottom >= docViewTop;
    },
    removeAnim: function removeAnim(fileItem, callback) {
        var el = $(fileItem);
        return el.css({ transition: "none" }).animate({ left: "-=" + (el.closest('#files_div').width() + 200) }, _globals.GS.cfg.anim.time, function () {
            $(this).css({ height: $(this).height(), padding: 0, border: 0, overflow: 'hidden' });
        }).animate({ height: 0, margin: -6 }, _globals.GS.cfg.anim.time, function () {
            $(this).remove();
            $(window).trigger("resize");
            if (typeof callback === 'function') {
                callback(el);
            }
        });
    },
    shakeAnim: function shakeAnim(fileItem, callback) {
        var el = $(fileItem);
        var time = 20;
        var width = 20;
        el.css({ transition: "none" }).animate({ left: '-=' + width / 2 }, time).animate({ left: '+=' + width }, time).animate({ left: '-=' + width }, time).animate({ left: '+=' + width }, time).animate({ left: '-=' + width / 2 }, time, function () {
            el.removeAttr('style');
            if (typeof callback === 'function') {
                callback(el);
            }
        });
    },
    activateFileItem: function activateFileItem(fileItem, selection) {
        var el = $(fileItem);
        switch (selection) {
            case 'select':
                el.addClass('file_item_selected').removeClass('selecting');
                break;
            case 'deselect':
                el.removeClass('file_item_selected').removeClass('selecting');
                break;
            case 'toggle':
                if (el.hasClass('file_item_selected')) {
                    return _globals.GS.ui.activateFileItem(el, 'deselect');
                } else {
                    return _globals.GS.ui.activateFileItem(el, 'select');
                }
                break;
            default:
                _globals.GS.ui.activateFileItem(el, 'select');
                _globals.GS.ui.shakeAnim(el, function (el) {
                    _globals.GS.ui.activateFileItem(el, 'deselect');
                });
        }
        return selection;
    },
    showToast: function showToast(config) {
        switch (config.type) {
            case 'info':
                TS.ui.toast.show(config);
                $('.toast').addClass('alert_info');
                break;
            default:
                TS.ui.toast.show(config);
        }
    },

    showPageAlert: function showPageAlert(config) {
        var conf = {
            body: '&nbsp;',
            type: 'info',
            icon: 'ts_icon_info',
            id: '',
            dismissable: false
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
        var alert = $(_globals.GS.templates.pageAlert(conf));
        alert.hide().find('.dismiss').on('click', function () {
            _globals.GS.ui.dismissPageAlert(this);
        });
        $('#page_contents').prepend(alert);
        alert.slideDown(_globals.GS.cfg.anim.time);
    },
    dismissPageAlert: function dismissPageAlert(el) {
        $(el).closest('.alert').slideUp(_globals.GS.cfg.anim.time, function () {
            $(el).remove();
        });
    },
    deleteSingleFile: function deleteSingleFile(fileItem) {
        $(fileItem).trigger('file:delete', [function (id, fileTitle, error) {
            var toast = {
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
            _globals.GS.ui.showToast(toast);
        }]);
    },
    initPager: function initPager() {
        var pageLink = _globals.GS.url.path + '?page=';
        var page = _globals.GS.paging.page;
        var right = _globals.GS.paging.pages - page;
        var left = page - 1;
        var prevPage = _globals.GS.templates.pagerLink({
            href: left ? pageLink + (page - 1) : '#',
            text: 'Prev',
            disabled: !left
        });
        var nextPage = _globals.GS.templates.pagerLink({
            href: right ? pageLink + (page + 1) : '#',
            text: 'Next',
            disabled: !right
        });
        var pageLinks = prevPage;

        pageLinks += _globals.GS.templates.pagerLink({
            href: _globals.GS.url.path,
            text: '1',
            active: page === 1
        });
        if (left > 4) {
            pageLinks += _globals.GS.templates.pagerLink({
                href: '#',
                text: '...',
                disabled: true
            });
        }
        for (var i = 2; i < _globals.GS.paging.pages; i++) {
            var dist = Math.abs(page - i);
            if (i <= page) {
                if (left <= 4 || dist <= 2 || i > _globals.GS.paging.pages - 7) {
                    pageLinks += _globals.GS.templates.pagerLink({
                        href: pageLink + i,
                        text: i,
                        active: page === i
                    });
                }
            } else {
                if (right <= 4 || dist <= 2 || i <= 7) {
                    pageLinks += _globals.GS.templates.pagerLink({
                        href: pageLink + i,
                        text: i,
                        active: page === i
                    });
                }
            }
        }
        if (right > 4) {
            pageLinks += _globals.GS.templates.pagerLink({
                href: '#',
                text: '...',
                disabled: true
            });
        }
        pageLinks += _globals.GS.templates.pagerLink({
            href: pageLink + _globals.GS.paging.pages,
            text: _globals.GS.paging.pages,
            active: page === _globals.GS.paging.pages
        });
        pageLinks += nextPage;
        $('.pagination-centered').removeClass('hidden').find('ul').html(pageLinks);
    },
    initTools: function initTools() {
        $('#files_create_space_btn').after('<div id="batch_actions" class="batch_actions" style="display: none;"></div>');
        var $batchActions = $('#batch_actions');
        $batchActions.bind("DOMSubtreeModified", function () {
            if (_globals.GS.sizeOf(_globals.GS.data.selectedFiles) > 0) {
                $(this).slideDown();
            } else {
                $(this).slideUp();
            }
        });
        $batchActions.append(_globals.GS.templates.batchTools());
        $('#files_batch_delete_btn').click(_globals.GS.files.batch.deleteFiles);
        $('#files_batch_download_btn').click(_globals.GS.files.batch.downloadFiles);
        $('#files_batch_deselect_btn').click(_globals.GS.files.batch.deselectFiles);

        _globals.GS.files.batch.updateFileTools();
    },
    initFileItem: function initFileItem(fileId, fileItem) {
        var file = _globals.GS.data.viewFiles[fileId];
        _globals.GS.debug.info('Initializing item:' + fileItem.attr('id'));
        if (!fileItem) {
            return "err";
        }
        if (fileItem.children('.check_overlay').length > 0) {
            return "err";
        }

        if (_globals.GS.user.id == file.user) {
            fileItem.addClass('file_owner');
        }

        var actionsEl = fileItem.find('.actions');
        fileItem.wrapInner(_globals.GS.templates.check_overlay(file.id));

        if (file.is_external) {
            actionsEl.prepend(_globals.GS.templates.actionsButton(file, {
                action: 'external',
                tag: 'a',
                icon: _globals.GS.templates.externalFileIcon(file.external_type),
                color: 'blue',
                tip: 'Open',
                href: file.url_private
            }));
        }
        if (file.can_download) {
            actionsEl.prepend(_globals.GS.templates.actionsButton(file, {
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
            actionsEl.prepend(_globals.GS.templates.actionsButton(file, {
                action: 'delete',
                tag: 'button',
                icon: 'ts_icon_trash',
                color: 'red',
                tip: 'Delete'
            }));
        }
        actionsEl.after('<div class="actions bottom">' + _globals.GS.templates.actionsButton(file, {
            action: 'check',
            tag: 'div',
            icon: 'ts_icon_check_square_o',
            color: 'orange',
            color_owner: 'blue',
            tip: 'Deselected',
            tip_active: 'Selected',
            active: true,
            noborder: true,
            show_selected: true
        }) + '</div>');

        fileItem.find('.filetype_image, .filetype_icon').wrap('<a href="' + file.permalink + '"></a>');

        fileItem.find('.check_overlay').click(function (event) {
            var target = $(event.target);
            if (target.is(".file_star, .star_file")) {
                return;
            }
            event.stopPropagation();
            if (target.closest('a, button').length > 0) {
                return;
            }
            var id = _globals.GS.ui.getItemFileId(this);
            var sel = _globals.GS.files.selectFile(id, 'toggle');
            _globals.GS.data.saveData();
            _globals.GS.ui.getParentFileItem(this).addClass('selecting').trigger('file:select', [sel]);
        });

        fileItem.find("button[data-action='delete']").click(function (event) {
            event.stopPropagation();
            var title = _globals.GS.ui.getItemFileTitle(this);
            var fileItem = _globals.GS.ui.getParentFileItem(this);
            if (_globals.GS.cfg.promptDelete) {
                TS.generic_dialog.start({
                    title: 'Delete file',
                    body: 'Are you sure you want to delete this file ("' + title + '") permanently?',
                    show_cancel_button: true,
                    show_go_button: true,
                    go_button_text: "Yes, delete this file",
                    go_button_class: "btn_danger",
                    cancel_button_text: "Cancel",
                    onGo: function onGo() {
                        _globals.GS.ui.deleteSingleFile(fileItem);
                        _globals.GS.cfg.promptDelete = false;
                    }
                });
            } else {
                _globals.GS.ui.deleteSingleFile(fileItem);
            }
        });

        fileItem.on('file:select', _globals.GS.events.onSelect).on('file:remove', _globals.GS.events.onRemove).on('file:delete', _globals.GS.events.onDelete);
        if (_globals.GS.data.selectedFiles[file.id] !== undefined) {
            fileItem.trigger('file:select', ['select']);
        }
    }
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(12);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(14)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--0-1!../../node_modules/sass-loader/lib/loader.js!./default.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--0-1!../../node_modules/sass-loader/lib/loader.js!./default.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(undefined);
// imports


// module
exports.push([module.i, "#page_contents{overflow:hidden}.span_2_of_3{padding:0}#files_div{padding-right:2%}#files_list .file_list_item{padding:0;transition:all .15s;left:0}#files_list .file_list_item.file_item_selected{box-shadow:2px 3px 10px;left:-2px}#files_list .file_list_item.deleting{pointer-events:none;border:0}.file_list_item.file_item_selected.file_owner:not(:hover){background-color:#f0f8ff}.file_list_item.file_item_selected:not(:hover){background-color:#fdf5e6}.file_list_item .overlay{position:absolute;background-color:hsla(0,0%,100%,.7);left:0;right:0;bottom:0;top:0;z-index:1000;border-radius:6px;display:-ms-flexbox;-ms-flex-pack:center;-ms-flex-align:center;display:-moz-box;-moz-box-pack:center;-moz-box-align:center;display:-webkit-box;-webkit-box-pack:center;-webkit-box-align:center;display:flex;box-pack:center;box-align:center}.file_list_item .check_overlay{width:100%;padding:.25rem}.file_list_item.file_owner .title a{color:#2d9ee0!important}.file_list_item .actions.bottom{top:auto;bottom:0}.file_list_item .actions .btn_outline.noborder:active:after{box-shadow:none}.file_list_item .actions a.btn{background:#2ab27b;color:#fff;-webkit-font-smoothing:antialiased;font-family:Slack-Lato,appleLogo,sans-serif;line-height:1.2rem;font-weight:900;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;text-decoration:none;cursor:pointer;text-shadow:0 1px 1px rgba(0,0,0,.1);border:none;border-radius:.25rem;box-shadow:none;position:relative;display:inline-block;vertical-align:bottom;text-align:center;white-space:nowrap;margin:0;-webkit-appearance:none;-webkit-tap-highlight-color:transparent}.tab_container .file_list_item .actions .file_action{margin-top:0;background-color:transparent}.tab_container .file_list_item .actions .action{position:absolute;top:0;left:0;z-index:1;border:0;width:1.875rem;height:1.75rem;color:#555459}.action{cursor:default;font-style:normal;color:#babbbf}.action,.action:before{font-size:.8rem}.action:hover{opacity:1;-moz-opacity:1;-khtml-opacity:1}.action:not(.not-clickable){cursor:pointer}.file_list_item .actions .active,.file_list_item .actions .active .green,.file_list_item .actions .active .green_owner,.file_list_item .actions .green:hover,.file_list_item .actions .green_owner:hover,.file_list_item .actions :hover{color:#2ab27b;border-color:#2ab27b}.file_list_item .actions .active .red,.file_list_item .actions .red:hover,.file_list_item.file_owner .actions .active .red_owner,.file_list_item.file_owner .actions .red_owner:hover{color:#eb4d5c;border-color:#eb4d5c}.file_list_item .actions .active .blue,.file_list_item .actions .blue:hover,.file_list_item.file_owner .actions .active .blue_owner,.file_list_item.file_owner .actions .blue_owner:hover{color:#2d9ee0;border-color:#2d9ee0}.file_list_item .actions .active .yellow,.file_list_item .actions .yellow:hover,.file_list_item.file_owner .actions .active .yellow_owner,.file_list_item.file_owner .actions .yellow_owner:hover{color:#fc0;border-color:#fc0}.file_list_item .actions .active .orange,.file_list_item .actions .orange:hover,.file_list_item.file_owner .actions .active .orange_owner,.file_list_item.file_owner .actions .orange_owner:hover{color:#dfa941;border-color:#dfa941}.file_list_item .actions .active .ts_tip_tip:not(.tip_active),.file_list_item .actions :not(.active) .ts_tip_tip.tip_active{display:none}.file_list_item .actions .btn.noborder:after{border:none}.file_list_item .actions .btn.active.noborder:after{box-shadow:none}.file_list_item.file_item_selected .actions .hide_selected,.file_list_item:not(.file_item_selected) .actions .show_selected{display:none}.loading_animation{text-align:center;color:#999;font-family:Slack-Lato,appleLogo,sans-serif;font-size:.9rem;margin:9rem 0}#file_page_comments .loading_animation{margin:0 0 1rem}.loading_animation img{width:40px;height:40px;margin:0 1rem .5rem .5rem}.alert_page.alert_info{background:#3aa3e3}#toast.toast_out .toast{bottom:0;transition:all .2s}#toast div.toast{width:auto;margin-left:auto;text-align:center;padding:10px;position:fixed;z-index:1;left:3rem;right:3rem;bottom:15px;box-shadow:2px 3px 10px #555459;border:.0625rem solid transparent;border-radius:6px;opacity:.95}@media only screen and (min-width:1024px){#toast div.toast{width:920px;margin-left:-460px;left:50%}}@media only screen and (max-width:640px){#toast div.toast{width:auto;margin-left:auto;left:1.5rem;right:1.5rem}}@-webkit-keyframes progress-bar-stripes{0%{background-position:40px 0}to{background-position:0 0}}@keyframes progress-bar-stripes{0%{background-position:40px 0}to{background-position:0 0}}.progress{height:20px;margin-bottom:20px;overflow:hidden;background-color:#f5f5f5;border-radius:4px;-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.1);box-shadow:inset 0 1px 2px rgba(0,0,0,.1);position:relative}.progress-bar.active,.progress.active .progress-bar,.progress.progress-bar-striped.active{-webkit-animation:progress-bar-stripes 2s linear infinite;-o-animation:progress-bar-stripes 2s linear infinite;animation:progress-bar-stripes 2s linear infinite}.progress.progress-bar-striped.active{background-color:#c3c3c3}.progress-bar-striped,.progress-striped .progress-bar{background-image:-webkit-linear-gradient(45deg,hsla(0,0%,100%,.15) 25%,transparent 0,transparent 50%,hsla(0,0%,100%,.15) 0,hsla(0,0%,100%,.15) 75%,transparent 0,transparent);background-image:-o-linear-gradient(45deg,hsla(0,0%,100%,.15) 25%,transparent 25%,transparent 50%,hsla(0,0%,100%,.15) 50%,hsla(0,0%,100%,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,hsla(0,0%,100%,.15) 25%,transparent 0,transparent 50%,hsla(0,0%,100%,.15) 0,hsla(0,0%,100%,.15) 75%,transparent 0,transparent);-webkit-background-size:40px 40px;background-size:40px 40px}.progress-bar{float:left;width:0;height:100%;font-size:12px;line-height:20px;color:#fff;text-align:center;background-color:#337ab7;-webkit-box-shadow:inset 0 -1px 0 rgba(0,0,0,.15);box-shadow:inset 0 -1px 0 rgba(0,0,0,.15);-webkit-transition:width .6s ease;-o-transition:width .6s ease;transition:width .6s ease}.progress-bar.label{width:100%;float:none;position:absolute;background:none}.progress-bar-success{background-color:#2ab27b}.progress-bar-info{background-color:#2d9ee0}.progress-bar-warning{background-color:#edb431}.progress-bar-error{background-color:#cb5234}.alert .progress{margin-bottom:0;margin-top:2px}.alert.dismissable{padding-right:3rem}.alert.dismissable>i.ts_icon.dismiss,.alert>ts_icon.dismiss{margin-left:.5rem;margin-right:-2rem;width:1.25rem;text-align:center;float:right;color:#9e9ea6}.alert.dismissable>i.ts_icon.dismiss:hover,.alert>ts_icon.dismiss:hover{color:#eb4d5c!important}", ""]);

// exports


/***/ }),
/* 13 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(15);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 15 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);
})();