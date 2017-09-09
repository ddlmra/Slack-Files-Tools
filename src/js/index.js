import {GS as GS} from './modules/globals'
import __config from "./config";
import __data from "./modules/data"
import * as __utils from './modules/utilities';
import __files from "./modules/files";
import __events from "./modules/events";
import __templates from "./modules/templates";
import __ui from "./modules/ui";

boot_data.files = [];
GS.cfg = __config;

loadUtils();
parseUrl();
initGlobals();
loadRes();
// GS.loadStyle(GS.cfg.styles);

GS.debug.info(GS.cfg);

$('.pagination-centered').addClass('hidden');
let viewSummary = $('.span_1_of_3>p.subtle_silver').addClass('hidden');

if ($('#files_div').length) {
    $(".loading_hash_animation").on("remove", function () {
        $('#files_list').hide().before(GS.templates.loadingAnim());
        GS.data.loadData().then(finalizeBoot);
    });
} else {
    $('#files_owner').bind("DOMSubtreeModified", function () {
        $(this).unbind("DOMSubtreeModified");
        GS.data.loadData().then(GS.ui.initTools);
    });
}

function finalizeBoot() {
    GS.debug.info('Boot complete');
    let $filesList = $('#files_list');
    $filesList.removeClass('loaded');

    viewSummary.find('strong:nth-child(1)').attr('id', 'view_files_from');
    viewSummary.find('strong:nth-child(2)').attr('id', 'view_files_to');
    viewSummary.find('strong:nth-child(3)').attr('id', 'view_files_total');

    TS.web.files.renderFiles(boot_data.files);

    GS.debug.info('Files rendered');
    GS.ui.initTools();
    $filesList.before(GS.templates.selectAllCb('files_select_all_top'));
    $filesList.after(GS.templates.selectAllCb('files_select_all_bottom'));
    $('.files_select_all_cb').click(GS.files.batch.selectAllCb);

    GS.files.batch.updateFileTools();
    $('.span_1_of_3>p.subtle_silver').removeClass('hidden');
    if (GS.paging.pages > 1) {
        GS.ui.initPager();
    }
    GS.debug.info('Initializing files items');
    let listItems = $('.file_list_item');
    listItems.each(function () {
        GS.ui.initFileItem(GS.ui.getItemFileId(this), $(this));
    });
    $('#loading').remove();
    $filesList.slideDown(1000);
}

function loadRes() {
    GS.templates = __templates;
    GS.files = __files;
    GS.events = __events;
    GS.ui = __ui;
}

function initGlobals() {
    GS.user = {
        id: boot_data.user_id,
        username: $('#user_menu_name').text(),
        team: $('script:contains(TS.clog.setTeam)').text().replace(/(?:.|[\r\n])*?TS\.clog\.setTeam\('(T[A-Z0-9]+)(?:.|[\r\n])*/, '$1'),
        admin: !!$('#admin_nav').length
    };
    GS.paging = {
        from: 0,
        to: 0,
        total: 0,
        page: 0,
        pages: 0,
        per_page: 0
    };
    GS.data = __data;
}

function loadUtils() {
    GS.debug = __utils.debug;
    GS.sizeOf = __utils.sizeOf;
    GS.loadStyle = __utils.loadStyle;
}

function parseUrl() {
    let urlHash = location.hash.slice(1);
    let urlPath = location.pathname.split('/');
    GS.url = {
        protocol: location.protocol,
        team: location.protocol + '//' + location.host,
        path: location.pathname,
        user: urlPath[2] ? urlPath[2] : 'all',
        page: location.search ? parseInt(location.search.replace(/.*?page=([0-9]+).*/, '$1'), 10) : 1,
        filter: 'all'
    };
    if (urlPath[3]) {
        location.hash = '';
        GS.url.filter = urlPath[3];
        GS.url.search = false;
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


