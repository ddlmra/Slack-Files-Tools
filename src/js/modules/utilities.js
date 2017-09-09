import {GS as GS} from './globals'

export let debug = {
    logMessage: function () {
        if (!GS.cfg.debug || arguments.length < 2) return;

        let type = arguments[0];
        let newArgs = Array.prototype.slice.call(arguments, 1);
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
    info: function () {
        if (arguments.length > 0) {
            GS.debug.logMessage.apply(this, ['info'].concat(Array.prototype.slice.call(arguments)));
        }
    },
    error: function () {
        if (arguments.length > 0) {
            GS.debug.logMessage.apply(this, ['error'].concat(Array.prototype.slice.call(arguments)));
        }
    },
    warn: function () {
        if (arguments.length > 0) {
            GS.debug.logMessage.apply(this, ['warn'].concat(Array.prototype.slice.call(arguments)));
        }
    },
    log: function () {
        if (arguments.length > 0) {
            GS.debug.logMessage.apply(this, ['log'].concat(Array.prototype.slice.call(arguments)));
        }
    },
};

export function sizeOf(obj) {
    if ($.isFunction(Object.keys)) {
        return Object.keys(obj).length;
    }
    let size = 0;
    for (let key in obj) {
        size++;
    }
    return size;
}

export function loadStyle(styles) {
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