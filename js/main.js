var sivId, fadeinmovId, foimId, speedId;

var imp_style;

var old_chapter = chapter = 0;

var wlh, folders;

var enumerateDaysBetweenDates = function(startDate, endDate) {
    var dates = [],
        currentDate = startDate,
        addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };
    while (currentDate <= endDate) {
        dates.push(currentDate);
        currentDate = addDays.call(currentDate, 1);
    }
    return dates;
};

var write_day = function(t) {

    t.parentNode.parentNode.previousSibling.classList.remove('form_check_white');
    t.parentNode.parentNode.previousSibling.classList.add('form_check_blue');


    t.parentNode.nextSibling.value = t.innerHTML + '. ' + adjustments_de.monthNames[avdays[getchildindex(t) - 1].getMonth()] + ' ' + avdays[getchildindex(t) - 1].getFullYear();
    sh_dat.sh(t.parentNode, 0);
    sh_dat.dis = false;

    setTimeout(function() {
        sh_dat.dis = true;
    }, 1500);

};

var sh_dat = {
    "dis": true,
    "sh": function(el, d) {

        // el = timemachine


        if (!sh_dat.dis) {
            return;
        }

        if (d == 0) {

            shop.time(el.nextSibling);

            el.classList.remove('tima_in');
            el.classList.add('tima_out');
            el.nextSibling.style.opacity = 1;

        } else {

            sh_dat.highlight(el);

            el.classList.remove('tima_out');
            el.classList.add('tima_in');
            el.nextSibling.style.opacity = 0;

        }

    },
    "highlight": function(t) {

        var sel_day = [];

        for (var sx = 0; sx < shop.items.length; sx++) {

            if (shop.items[sx].Artikel.indexOf('Terminanfrage') != -1) {

                var sel_day = shop.items[sx].Artikel.replace('Terminanfrage für ', '').split(' ');

                sel_day[0] = sel_day[0].replace('.', '');

                break;

            }

        }

        if (sel_day.length == 0) {
            return;
        }

        if (sel_day[1] == t.children[0].innerHTML.split(' / ')[0]) {

            for (var sx = 1; sx < t.children.length; sx++) {
                t.children[sx].classList.remove('sel_day');

                if (t.children[sx].innerHTML == sel_day[0]) {
                    t.children[sx].classList.add('sel_day');
                    sel_day[0] = 0;
                }
            }

        } else {

            for (var sx = t.children.length - 1; sx > 0; sx--) {
                t.children[sx].classList.remove('sel_day');

                if (t.children[sx].innerHTML == sel_day[0]) {
                    t.children[sx].classList.add('sel_day');
                    sel_day[0] = 0;
                }
            }

        }

    },
    "check": function(t) {
        if (t.classList.contains('form_check_white')) {
            sh_dat.sh(t.nextSibling.children[0], 1);
        } else {
            t.nextSibling.children[1].value = '';
            t.classList.remove('form_check_blue');
            t.classList.add('form_check_white');
            shop.time(t.nextSibling.children[1]);
        }
    },
    "file_proc": function(t) {
        t.previousSibling.value = (t.value.lastIndexOf('\\') == -1) ? t.value : t.value.slice(t.value.lastIndexOf('\\') + 1);
    }
};

var today = [new Date()];

today.push(new Date(today[0].getFullYear(), today[0].getMonth(), today[0].getDate() + 3));
today.push(new Date(today[1].getFullYear(), today[1].getMonth() + 1, today[1].getDate()));

var avdays = enumerateDaysBetweenDates(today[1], today[2]);

var parent_media = function(t, n) {

    sub_chapter(t.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling.getElementsByTagName('span')[n]);

};


var toggle_imp_run = function(t) {

    t.focus();

    if (t.style.animationPlayState == 'running' || t.style.WebkitAnimationPlayState == 'running') {
        t.style.WebkitAnimationPlayState = 'paused';
        t.style.animationPlayState = 'paused';
    } else {
        t.style.WebkitAnimationPlayState = 'running';
        t.style.animationPlayState = 'running';
    }

};


var sub_chapter = function(t) {

    if (t.innerHTML.toLowerCase().indexOf('abschicken') != -1) {

        shop.preSendData();

        return;

    }

    if (t.innerHTML.toLowerCase().indexOf('impressionen') != -1) {

        var fa_eye = document.getElementsByClassName('fa-eye')[folders[chapter].last_position];

        fa_eye.ix = folders[chapter].last_position;

        see(fa_eye, 1, -210);

        window.scrollTo(0, fa_eye.parentNode.parentNode.nextSibling.offsetTop - 102);

        return;

    }

    if (t.innerHTML.toLowerCase().indexOf('film') != -1) {

        var fa_eye = document.getElementsByClassName('fa-eye')[folders[chapter].last_position];

        fa_eye.ix = folders[chapter].last_position;

        see(fa_eye, 1, -210);

        window.scrollTo(0, fa_eye.parentNode.parentNode.nextSibling.offsetTop - 102);

        setTimeout(function() {

            show_video(folders[chapter].data[folders[chapter].last_position].epilog.Film);

        }, 500);

        return;

    }

    if (t.innerHTML.toLowerCase().indexOf('hören') != -1) {

        setTimeout(function() {

            hear_audio('images/' + folders[chapter].name, folders[chapter].data[folders[chapter].last_position].epilog.Hören);

        }, 500);

        return;

    }

    /*
        if (t.innerHTML.toLowerCase().indexOf('bestellung') != -1 && folders[chapter].data[folders[chapter].last_position].comp_name == 'bestellen') {

            loadForm();

            return;

        }
    */

    set_epi_menu_color(t);

    var c = folders[chapter].data;

    folders[chapter].data[folders[chapter].last_position].imp_cheese_state = false;

    switch (t.innerHTML) {
        case 'Einleitung':
        case 'Kontakt':
            var pr = (c[folders[chapter].last_position].prolog == '') ? '' : '<h2>' + c[folders[chapter].last_position].prolog + '</h2><br/><br/>';
            t.parentNode.previousSibling.innerHTML = pr + c[folders[chapter].last_position].text;
            sh_cheese(t.parentNode.parentNode, 0);
            break;
        case 'Bestellung':
            t.parentNode.previousSibling.innerHTML = c[folders[chapter].last_position].epilog[t.innerHTML][0];
            sh_cheese(t.parentNode.parentNode, 0);
            break;
        case 'Impressum':

            if (imp_style == 'old') {
                t.parentNode.previousSibling.innerHTML = '<dl>';
                for (var key in c[folders[chapter].last_position].epilog[t.innerHTML]) {
                    var persons = '';
                    for (var i = 0; i < c[folders[chapter].last_position].epilog[t.innerHTML][key].length; i++) {

                        var is_person = false;

                        for (var d = 0; d < folders[0].data.length; d++) {
                            if (folders[0].data[d].name == c[folders[chapter].last_position].epilog[t.innerHTML][key][i].replace(' (palma3)', '')) {
                                is_person = true;
                                break;
                            }
                        }

                        var is_linked = (is_person) ? '<a onclick="search_nostyle(this)">' + c[folders[chapter].last_position].epilog[t.innerHTML][key][i] + '</a>' : c[folders[chapter].last_position].epilog[t.innerHTML][key][i];

                        persons += '<dd>' + is_linked + '</dd>';
                    }

                    t.parentNode.previousSibling.innerHTML += '<span class="inta"><dt>' + key + '</dt>' + persons + '</span>';
                }
                t.parentNode.previousSibling.innerHTML += '</dl>';

            } else {

                folders[chapter].data[folders[chapter].last_position].imp_cheese_state = true;

                var sl_ih = '<div class="imp_abs"><div class="imp_slid">';

                for (var key in c[folders[chapter].last_position].epilog[t.innerHTML]) {
                    var persons = '';
                    for (var i = 0; i < c[folders[chapter].last_position].epilog[t.innerHTML][key].length; i++) {

                        var is_person = false;

                        for (var d = 0; d < folders[0].data.length; d++) {
                            if (folders[0].data[d].name == c[folders[chapter].last_position].epilog[t.innerHTML][key][i].replace(' (palma3)', '')) {
                                is_person = true;
                                break;
                            }
                        }

                        var is_linked = (is_person) ? '<a onclick="search_nostyle(this)">' + c[folders[chapter].last_position].epilog[t.innerHTML][key][i] + '</a>' : c[folders[chapter].last_position].epilog[t.innerHTML][key][i];

                        persons += '<p class="slid_imp_text">' + is_linked + '</p>';
                    }

                    sl_ih += '<p class="slid_imp_title">' + key + '</p>' + persons;
                }

                sl_ih += '</div></div>';

                var x = t.parentNode.parentNode.offsetWidth;
                var y = calc_min_slid_height(t.parentNode.children.length);

                if (t.parentNode.parentNode.getElementsByClassName('cheese').length == 1) {
                    t.parentNode.parentNode.removeChild(t.parentNode.parentNode.getElementsByClassName('cheese')[0]);
                }
                var ca = document.createElement('canvas');
                ca.width = x;
                ca.height = y;
                ca.className = 'cheese';
                t.parentNode.parentNode.appendChild(ca);

                t.parentNode.previousSibling.innerHTML = sl_ih;

                var el = t.parentNode.previousSibling.getElementsByClassName('imp_slid')[0];

                el.parentNode.style.margin = '16px 0 10px 0';

                el.parentNode.style.height = y - 110 + 'px';


                if (el.offsetHeight < t.parentNode.offsetHeight) {
                    el.classList.remove('imp_slid');
                    //el.classList.add('imp_no_slid');

                } else {

                    el.style.WebkitAnimationPlayState = 'running';
                    el.style.animationPlayState = 'running';

                    el.parentNode.addEventListener('mouseup', function() {
                        toggle_imp_run(el);
                    }, false);

                }

                sh_cheese(t.parentNode.parentNode, 1);

            }
            break;
        default:

            var ih = (t.innerHTML != 'Orte und Daten') ? t.innerHTML : 'Ausstellungsort';
            t.parentNode.previousSibling.innerHTML = c[folders[chapter].last_position].epilog[ih];
            console.log('default sh_cheese');
            sh_cheese(t.parentNode.parentNode, 0);
    }

    console.log(t.parentNode.parentNode.getBoundingClientRect().top);
    console.log(t.parentNode.parentNode.offsetHeight);

    if (t.parentNode.parentNode.getBoundingClientRect().top + t.parentNode.parentNode.offsetHeight > window.innerHeight) {
        //old_chapter = -1;
        window.scrollTo(0, t.parentNode.parentNode.offsetTop - 210);
    }


};


var draw_cheese_canvas = function(canvas, x, y) {

    var ctx = canvas.getContext("2d");

    ctx.fillStyle = 'rgba(255,255,255, 0.9)';
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    ctx.globalCompositeOperation = 'xor';

    ctx.fillStyle = '#fff';
    ctx.fillRect(8, 90, canvas.offsetWidth - 198, canvas.offsetHeight - 98);

    ctx.globalCompositeOperation = 'source-over';

    ctx.fillStyle = 'rgba(255,255,255, 0.3)';
    ctx.fillRect(8, 90, canvas.offsetWidth - 198, canvas.offsetHeight - 98);

};


var set_epi_menu_color = function(t) {

    t.parentNode.children[0].style.visibility = 'inherit';

    for (var i = 0; i < t.parentNode.children.length; i++) {
        t.parentNode.children[i].style.background = 'rgba(141, 170, 212, 0.9)';
        t.parentNode.children[i].style.color = '#333';
    }

    t.style.background = 'rgba(0,0,0,0)';
    t.style.color = '#bc123a';

};



var get_column_count = function(c, n) {

    if (window.innerWidth > 950) {
        var cs = (typeof c.columns === 'undefined') ? 'column-count:2' : 'column-count:' + c.columns;
    } else {
        var cs = 'column-count:1'
    }

    return cs;

};

var aut = function(arr) {
    var ul = '<ul class="author">';

    for (var k = 0; k < arr.length; k++) {

        /*
        Geboren 1971 in St. Gallen,
        lebt in Bern
        */

        /*
        ["Adrian Moser", "1966", "Biel", "Biel", "Ressortleiter Bild und Fotograf bei Der Bund", "www.adrianmoser.ch",""]
        */

        //														["","","","","","",""],
        //														["","","","","","",""],
        //														["","","","","","",""],
        //														["","","","","","",""],
        //														["","","","","","",""],


        var an = (arr[k][5] === true) ? '<a class="line" onclick="search_nostyle(this)">' + arr[k][0] + '</a>' : arr[k][0];

        var a = (arr[k][5] == '' || arr[k][5] === true) ? '' : '<a href="http://' + arr[k][5] + '" target="_blank" >' + arr[k][5] + '</a>';

        var b = (arr[k][3] == '') ? '' : ' in ' + arr[k][3];

        ul += '<li><span><p>' + an + '</p><p>' + arr[k][1] + '</p><p>Geboren ' + arr[k][2] + b + '</p><p>Lebt in ' + arr[k][4] + '</p><p>' + a + '</p><p>' + arr[k][6] + '</p></span></li>';

    }

    ul += '</ul>';

    return ul;

};

var plc = function(arr, c) {

    var ul = '<ul class="orandda">';

    for (var k = 0; k < arr.length; k++) {

        if (arr[k][0] == '') {

            if (c) {

                if (c.till) {

                    var tf = ' ' + c.from[2];
                    if (c.from[2] == c.till[2]) {
                        tf = '';
                    }

                    arr[k][0] = c.from[0] + '. ' + adjustments_de.monthNames[c.from[1] - 1] + tf + ' bis ' + c.till[0] + '. ' + adjustments_de.monthNames[c.till[1] - 1] + ' ' + c.till[2];

                } else {

                    arr[k][0] = 'Eröffnung: ' + c.from[0] + '. ' + adjustments_de.monthNames[c.from[1] - 1] + ' ' + c.from[2];

                }

            } else {

                arr[k][0] = '&nbsp;';

            }

        }

        var g = (arr[k][6] != '') ? '<a href="https://goo.gl/maps/' + arr[k][6] + '" target="_blank" ><i class="fa fa-map-marker" aria-hidden="true"></i>' : '<a>';

        var a = '';

        if (arr[k][5].indexOf('www') != -1 || arr[k][5].indexOf('blog') != -1) {
            var cut = arr[k][5].indexOf('/');
            var ad = (arr[k][5].indexOf('/') != -1) ? arr[k][5].slice(0, cut) : arr[k][5];
            a = '<a href="http://' + arr[k][5] + '" target="_blank" ><p>' + ad + '</p></a>';
        }

        ul += '<li><span><p>' + arr[k][0] + '</p>' + g + '<p>' + arr[k][1] + '</p><p>' + arr[k][2] + '</p><p>' + arr[k][3] + '</p><p>' + arr[k][4] + '</p></a>' + a + '</span></li>';

    }

    ul += '</ul>';

    return ul;

};




var inhalt = function(c, i) {

    var r = '';

    r += '<span class="scroll_positioner"></span><span class="ueandtx">' + '<span class="ue">' + c[i].name;
    r += (c[i].time) ? ' - ' + adjustments_de.monthNames[c[i].time.from[1] - 1] + ' ' + c[i].time.from[2] : '';
    r += (c[i].published) ? ' - ' + c[i].published.year : '';

    var cs = get_column_count(c[i]);

    var favicons = '' +

        '<i class="fa fa-download" aria-hidden="true"></i>' +

        '<i class="fa fa-pause" aria-hidden="true"></i>' +

        '<i class="fa fa-play" aria-hidden="true"></i>' +

        /*

<i class="fa fa-step-backward" aria-hidden="true"></i> +

                '<i class="fa fa-film" aria-hidden="true"></i>' +

                '<i class="fa fa-picture-o" aria-hidden="true"></i>' +

        */

        '<i class="fa fa-volume-off" aria-hidden="true"></i>' +

        '<i class="fa fa-volume-up" aria-hidden="true"></i>' +

        '<i class="fa fa-expand" aria-hidden="true"></i>' +

        '<i class="fa fa-eye" aria-hidden="true"></i>' +

        '<i class="fa fa-file-text-o" aria-hidden="true"></i>' +

        '';

    var img_nav = favicons;

    r += '<span class="sh">' + img_nav + '</span></span>' + '<span class="tx tx_out" style="-webkit-' + cs + ';-moz-' + cs + ';' + cs + ';">';

    var insert = ['', ''];

    if (typeof c[i].map !== 'undefined') {
        insert = ['<div id="palma_map"></div>', '<div style="height:400px;"></div>'];
    }

    if (typeof c[i].form !== 'undefined') {

        var timemachine = '<div class="timemachine" onmouseout="sh_dat.sh(this,0)" onmouseover="sh_dat.sh(this,1)">';

        timemachine += '<span style="cursor:default;">' + adjustments_de.monthNames[avdays[0].getMonth()] + ' / ' + adjustments_de.monthNames[avdays[avdays.length - 1].getMonth()] + '</span>';

        for (var tai = 0; tai < avdays.length; tai++) {

            var freedays = (avdays[tai].getDay() == 0 || avdays[tai].getDay() == 6) ? ' style="opacity:0.9;color:rgba(255,255,255,0.5);cursor:default;"' : ' onclick="write_day(this)"';

            timemachine += '<span' + freedays + '>' + avdays[tai].getDate() + '</span>';

        }

        timemachine += '</div>';

        var shop_content = '';

        shop_content += '<span><i class="fa fa-check form_check form_check_white" aria-hidden="true" onclick="sh_dat.check(this)"></i><span style="margin: 0;">' + timemachine + '<input placeholder="Terminvorschlag" type="text"/></span></span>';
        //
        var shop_arr = [
            [5, 0],
            [5, 1],
            [5, 2],
            [4, 2]
        ];

        for (var sai = 0; sai < shop_arr.length; sai++) {

            var fol = folders[shop_arr[sai][0]].data[shop_arr[sai][1]];

            shop_content += '<span><i class="fa fa-check form_check form_check_white" aria-hidden="true" onclick="shop.work(this)"></i><span style="width:180px;">' + fol.name + '</span><span id="pr' + fol.epilog.Bestellung[2] + '">CHF ' + fol.epilog.Bestellung[2] + '.00</span><input onchange="shop.calc(this)" onkeyup="shop.calc(this)" type="number" name="quantity" style="width:36px;" value="' + fol.epilog.Bestellung[3] + '" /><img src="shop/' + fol.comp_name + '.jpg" onclick="jump_to(' + shop_arr[sai][1] + ',' + shop_arr[sai][0] + ')" /></span>';

        }

        insert = ['<div id="palma_form"></div>', '<div id="palma_shop" class="palma_shop_ini">' + shop_content + '</div>', ' style="height:2px;"', '<h2 style="position:absolute;margin-top:176px;">Wollen Sie eine unserer Publikationen bestellen?</h2>'];


    }

    var ins_ts = (insert.length == 2) ? ['', ''] : [insert[2], insert[3]];

    r += (c[i].prolog == '') ? insert[0] : insert[0] + '<h2' + ins_ts[0] + '>' + c[i].prolog + '</h2>' + ins_ts[1];

    r += c[i].text + insert[1] + '</span>';

    if (typeof c[i].epilog !== 'undefined') {


        if (c[i].epilog.Ausstellungsort && Array.isArray(c[i].epilog.Ausstellungsort)) {
            c[i].epilog.Ausstellungsort = plc(c[i].epilog.Ausstellungsort, c[i].time);
        }

        if (c[i].epilog.Projektort && Array.isArray(c[i].epilog.Projektort)) {
            c[i].epilog.Projektort = plc(c[i].epilog.Projektort, c[i].time);
        }

        if (c[i].epilog.Autoren && Array.isArray(c[i].epilog.Autoren)) {
            c[i].epilog.Autoren = aut(c[i].epilog.Autoren);
        }

        if (c[i].epilog.Autorinnen && Array.isArray(c[i].epilog.Autorinnen)) {
            c[i].epilog.Autorinnen = aut(c[i].epilog.Autorinnen);
        }


        var einl = (chapter == 0 && i > 4) ? 'Kontakt' : 'Einleitung';

        //				var einl = (chapter > 0) ? 'Einleitung' : (c[i].comp_name != 'bestellen') ? 'Kontakt' : 'Bestellung';	// || key == 'Bestellung'

        r += '<div class="epilog epilog_ini"><span onclick="sub_chapter(this)">' + einl + '</span><br/>';

        r += (c[i].epilog.Ausstellungsort) ? '<span onclick="sub_chapter(this)">Orte und Daten</span><br/>' : '';

        r += (c[i].epilog.Impressionen) ? '<span onclick="sub_chapter(this)">Impressionen</span><br/>' : '';

        r += (c[i].epilog.Film) ? '<span onclick="sub_chapter(this)">Film</span><br/>' : '';

        r += (c[i].epilog.Hören) ? '<span onclick="sub_chapter(this)">Hören</span><br/>' : '';

        r += (c[i].epilog.Download) ? '<span onclick="download_pdf()">Download</span><br/>' : '';

        r += (c[i].epilog.App) ? '<span onclick="show_app(0,this)">App</span><br/>' : '';

        for (var key in c[i].epilog) {
            // || key == 'Autoren'
            r += (key == 'Film' || key == 'Hören' || key == 'Impressionen' || key == 'Download' || key == 'Info' || key == 'Ausstellungsort' || key == 'App') ? '' : '<span onclick="sub_chapter(this)">' + key + '</span><br/>';

        }

        r += '</div>';

    }

    r += '</span>';

    return r;

};

var do_me = function(i, a) {
    slide_lr(i, true);
    sh_me(0);
    if (typeof a !== 'undefined') {
        hear_audio('mediaguides/', a);
    }
};

var mpt;

var sh_me = function(sh, ih, t) {

    if (sh == 0) {

        mpt.style.visibility = 'hidden';

        return;

    }

    mpt.innerHTML = ih;
    mpt.style.visibility = 'visible';

    mpt.style.left = t.offsetLeft - mpt.offsetWidth / 2 - 372 + 'px';

    mpt.style.top = t.offsetTop + 24 + 'px';

};



var show_app = function(i, t) {

    console.log('show_app z663: app_display_data.act_app ', app_display_data.act_app);

    if (typeof t !== 'undefined') {
        set_epi_menu_color(t);
        console.log('sh_cheese');
        sh_cheese(t.parentNode.parentNode, 0);

    }

    i = (i == 0) ? '' : '_' + i;

    app_display_data.act_app = folders[chapter].data[folders[chapter].last_position].comp_name;

    loadXMLDoc('mediaguides/' + app_display_data.act_app + i + '.html', function() {

        if (xmlhttp.readyState == 4) {

            if (xmlhttp.status == 200) {

                document.getElementsByClassName('epilog')[folders[chapter].last_position].previousSibling.innerHTML = '<span id="map_place_title"></span>' + xmlhttp.responseText + '<div class="app_leftside"></div><div class="app_beside">' + app_display_data[app_display_data.act_app].apendix() + '</div>';

                mpt = document.getElementById('map_place_title');

                if (folders[chapter].data[folders[chapter].last_position].comp_name == 'maxfrisch' && i != '') {

                    document.getElementsByClassName('app_leftside')[0].addEventListener('click', function() {

                        show_app(0);

                    }, false);
                    document.getElementsByClassName('app_leftside')[0].innerHTML = '<br/>zurück zu den anderen Spaziergängen';
                    document.getElementsByClassName('app_leftside')[0].style.display = 'inline-block';

                    document.getElementsByClassName('app_beside')[0].children[0].innerHTML = 'Clicken Sie auf die Stationen der Karte.';

                    document.getElementById('map_canvas').scrollLeft = 420;
                    document.getElementById('map_canvas').scrollTop = 220;

                    var d = document.getElementsByClassName('pri')[0].getElementsByTagName('div');

                    for (var h = 0; h < app_display_data[app_display_data.act_app].img_ix.length; h++) {

                        d[h].ix = h;
                        d[h].addEventListener('click', function() {

                            do_me(app_display_data[app_display_data.act_app].img_ix[this.ix], 'maxfrisch_1_' + parseInt(this.ix + 1));

                        }, false);

                        d[h].addEventListener('mouseover', function() {

                            sh_me(1, app_display_data[app_display_data.act_app].plc_tx[this.ix], this);

                        }, false);

                        d[h].addEventListener('mouseout', function() {

                            sh_me(0);

                        }, false);

                    }

                }

                if (folders[chapter].data[folders[chapter].last_position].comp_name == 'monteverita') {

                    do_cords();

                }

            } else {

                //console.log('eth shit happens');

            }
        }

    });

};

var download_pdf = function() {

    var c = folders[chapter].data;

    var pr = (c[folders[chapter].last_position].prolog == '') ? '' : '<h2>' + c[folders[chapter].last_position].prolog + '</h2>';

    var str = '<p>' + c[folders[chapter].last_position].name + '</p><p>' + pr + '</p><p>' + c[folders[chapter].last_position].text + '</p><hr/><p>Ausstellungskonzept</p>' + c[folders[chapter].last_position].epilog.Ausstellungskonzept + '<hr/><p>Ausstellungsort</p><p>' + c[folders[chapter].last_position].epilog.Ausstellungsort + '</p>';

    var pre_pdf = document.createElement('div');

    pre_pdf.innerHTML = str;

    pre_pdf.className = 'prepdf';

    document.getElementById('chapter_content').appendChild(pre_pdf);


    var el_top = 0;

    var pdf_height = (window.innerWidth < 950) ? 600 : 500;

    var bo = (window.innerWidth < 950) ? 6 : 15;

    var wi = (window.innerWidth < 950) ? 198 : 180;

    for (var ci = 0; ci < pre_pdf.children.length; ci++) {

        if (pre_pdf.children[ci].offsetTop + pre_pdf.children[ci].offsetHeight > el_top + pdf_height) {

            var sp = document.createElement('span');

            sp.className = 'cut';

            pre_pdf.insertBefore(sp, pre_pdf.children[ci]);

            //console.log(pre_pdf.children[ci].offsetTop);
            el_top += pdf_height;
        }

    }

    str = pre_pdf.innerHTML;

    document.getElementById('chapter_content').removeChild(pre_pdf);

    pre_pdf = null;

    var str_arr = str.split('<span class="cut"></span>');

    var doc = new jsPDF();
    var elementHandler = {};

    for (var ai = 0; ai < str_arr.length; ai++) {

        var pre_pdf = document.createElement('div');

        pre_pdf.innerHTML = str_arr[ai];

        pre_pdf.className = 'prepdf';

        document.getElementById('chapter_content').appendChild(pre_pdf);

        if (ai > 0) {
            doc.addPage();
        }

        doc.setPage(ai + 1);

        doc.fromHTML(
            pre_pdf,
            bo, bo, {
                'width': wi,
                'elementHandlers': elementHandler
            });


        document.getElementById('chapter_content').removeChild(pre_pdf);

    }

    doc.output("dataurlnewwindow");

};

var bilder = function() {

    var c = folders[chapter].data;

    var r = [];

    for (var i = 0; i < c.length; i++) {

        r.push(c[i].bilder);

    }

    return r;

};

var white_head = function() {


    clearTimeout(sivId);

    sivId = setTimeout(function() {

        var h = get_page_scroll_position();

        var uat = document.getElementsByClassName('ueandtx');

        var midpoints = [];

        for (var i = 0; i < uat.length; i++) {

            // new way

            /*

            var point = '';

            var pre_point = parseInt(uat[i].offsetTop + 210 + uat[i].offsetHeight / 2);

            if (pre_point < h + 210) {

                var point = uat[i].offsetTop + uat[i].offsetHeight;

                console.log('overflow up');


            }

            if (pre_point > h + 210 + window.innerHeight) {

                var point = uat[i].offsetTop;

                console.log('overflow down');

            }

            if (point == '') {

                var point = pre_point;

                console.log('overflow normal');

            }

             */




            var pre_point = parseInt(uat[i].offsetTop + 210 + uat[i].offsetHeight / 2);

            switch (true) {
                case (pre_point < h + 210):
                    var point = uat[i].offsetTop + uat[i].offsetHeight;
                    break;
                case (pre_point > h + 210 + window.innerHeight):
                    var point = uat[i].offsetTop;
                    break;
                default:
                    var point = pre_point;
            }

            /*
            console.log(point);
            */

            midpoints.push(point);

            // old way

            //midpoints.push(parseInt(uat[i].offsetTop + 210 + uat[i].offsetHeight / 2));

        }

        //console.log('midarr: ', midpoints);

        console.log('mid (ultra new way): ', midpoints[folders[chapter].last_position]);

        //console.log('g: midarr,', h + window.innerHeight / 2 + 240);

        var g = getNearestNumber(midpoints, h + window.innerHeight / 2 + 240);

        if (folders[chapter].last_position == g && chapter == old_chapter) {
            console.log('ireturn in middle of white_head');
            return;
        }

        old_chapter = chapter;

        folders[chapter].last_position = g;

        document.getElementById('chapter_content').style.height = 'auto';

        change_image(folders[chapter].data[folders[chapter].last_position].comp_name + '_' + folders[chapter].data[folders[chapter].last_position].slid_count);

        document.getElementsByClassName('fa-angle-left')[0].style.display = document.getElementsByClassName('fa-angle-right')[0].style.display = (uat[folders[chapter].last_position].children[1].style.visibility == 'hidden' && folders[chapter].data[folders[chapter].last_position].epilog.Impressionen && !isTouchSupported() && folders[chapter].data[folders[chapter].last_position].video.playstate == 'closed') ? 'block' : 'none';

        if (typeof folders[chapter].data[g].form !== 'undefined') {

            loadForm();

        }
        if (typeof folders[chapter].data[g].map !== 'undefined') {

            loadMap();

        } else {

            map = null;

            if (document.getElementById('palma_map')) {
                document.getElementById('palma_map').innerHTML = '';
            }

        }

        if (document.getElementsByClassName('cheese')[0]) {

            if (folders[chapter].last_position > 0) {
                sh_cheese(uat[folders[chapter].last_position - 1], 0);
                //console.log('prev');
                if (folders[chapter].data[folders[chapter].last_position - 1].see_read_state == 1) {
                    uat[folders[chapter].last_position - 1].style.background = 'rgba(255,255,255,0)';
                }
            }

            sh_cheese(uat[folders[chapter].last_position], 1);

            if (folders[chapter].last_position < uat.length - 1) {
                //console.log('next');
                sh_cheese(uat[folders[chapter].last_position + 1], 0);
                if (folders[chapter].data[folders[chapter].last_position + 1].see_read_state == 1) {
                    uat[folders[chapter].last_position + 1].style.background = 'rgba(255,255,255,0)';
                }
            }

        }

    }, 100);

};

var load_media = function() {

    var u = 'media/' + folders[chapter].name + '/' + folders[chapter].data[folders[chapter].last_position].comp_name + '/';

    loadXMLDoc(u + 'media.txt?zuza' + Math.floor(Math.random() * (1000) + 1), function() {

        if (xmlhttp.readyState == 4) {

            if (xmlhttp.status == 200) {

                var obj = JSON.parse(xmlhttp.responseText);

                var r = '<ul>';

                for (var key in obj) {

                    var a = (isNaN(key)) ? 'href="' + u + key + '.pdf" target="_blank"' : 'onclick="parent_media(this,' + key + ')"';

                    switch (obj[key][3].toLowerCase()) {
                        case 'pdf':
                            var type = '<i class="fa fa-file-pdf-o" aria-hidden="true"></i>';
                            break;
                        case 'video':
                            var type = '<i class="fa fa-film" aria-hidden="true"></i>';
                            break;
                        case 'audio':
                            var type = '<i class="fa fa-volume-up" aria-hidden="true""></i>';
                            break;
                        default:
                            var type = obj[key][3] + ', ';
                    }

                    r += '<li><span style="display: inline-table;"><p style="margin-left: 8px;">' + obj[key][0] + '</p><p><a style="padding: 14px 8px 6px 8px;" ' + a + '>' + type + obj[key][1] + ', ' + obj[key][2] + '</a></p></span></il>';

                }

                r += '</ul>';

                folders[chapter].data[folders[chapter].last_position].epilog.Medienberichte = r;

            } else {

                //console.log('get_media_array shit happens');

            }
        }

    });

};

var change_image = function(img) {

    if (folders[chapter].data[folders[chapter].last_position].epilog.Medienberichte && folders[chapter].data[folders[chapter].last_position].epilog.Medienberichte === true) {

        //console.log('iload media');

        load_media();

    }

    img = img.replace('_0', '');

    if (typeof video_controls.prev_vid !== 'undefined' && folders[video_controls.prev_vid[0]].data[video_controls.prev_vid[1]].video.src != folders[chapter].data[folders[chapter].last_position].comp_name) {
        video_controls.hide();
    }

    if (folders[chapter].data[folders[chapter].last_position].video.playstate == 'open') {
        if (video_controls.act_src != folders[chapter].data[folders[chapter].last_position].comp_name) {
            show_video(folders[chapter].data[folders[chapter].last_position].comp_name);
        } else {
            //if (vid.paused) {
            video_controls.run();
            //}
        }

    }


    var test_imageObj = new Image();

    test_imageObj.onerror = function() {

        change_image('default');

        return;

    };

    test_imageObj.onload = function() {

        document.getElementById("hg_cover").style.backgroundImage = 'url("images/' + folders[chapter].name + '/' + img + '.jpg")';

        fade_img("hg_cover", "hg");

    };

    test_imageObj.src = 'images/' + folders[chapter].name + '/' + img + '.jpg';

};

var sh_epi = function() {

    var ep = document.getElementsByClassName('epilog');

    for (var i = 0; i < ep.length; i++) {


        if (i != folders[chapter].last_position) {

            //	all epilogues unless the actual one

            ep[i].previousSibling.classList.remove('tx_in');
            ep[i].previousSibling.classList.add('tx_out');
            ep[i].classList.remove('change_img_in');
            ep[i].classList.add('change_img_out');
            ep[i].style.visibility = 'hidden';

        } else {

            //	the actual epilogue

            if (folders[chapter].data[i].see_read_state == 0) {
                ep[i].style.visibility = 'visible';
            }
            ep[i].previousSibling.classList.remove('tx_out');
            ep[i].previousSibling.classList.add('tx_in');
            ep[i].classList.remove('change_img_out');
            ep[i].classList.add('change_img_in');

        }

    }

};

fade_img = function(over, under) {

    sh_epi();

    var over = document.getElementById(over);

    over.classList.add('change_img_in');

    setTimeout(function() {

        document.getElementById(under).style.backgroundImage = over.style.backgroundImage;

        over.classList.remove('change_img_in');

    }, 400);

};

var vid = '';
var video_controls = {
    //"prev_vid": [],
    "act_src": "",
    "run": function() {

        if (aud != '') {
            media_kind = 'v';
            aud.pause();
        }

        folders[chapter].data[folders[chapter].last_position].video.playstate = 'open';

        vid.ontimeupdate = function() {
            folders[video_controls.prev_vid[0]].data[video_controls.prev_vid[1]].video.time = vid.currentTime;
        };

        vid.currentTime = (folders[chapter].data[folders[chapter].last_position].video.time < vid.duration - 2) ? folders[chapter].data[folders[chapter].last_position].video.time : 0;

        this.prev_vid = [chapter, folders[chapter].last_position];

        this.show();

        vid.play();

    },
    "pause": function() {
        if (vid != '') {
            vid.pause();
        }
    },
    "mute": function() {
        vid.muted = true;
    },
    "unmute": function() {
        vid.muted = false;
    },
    "show": function() {
        fade_mov("hg_media", "in");
    },
    "hide": function() {
        fade_mov("hg_media", "out");
        if (folders[chapter].data[folders[chapter].last_position].video.playstate == 'closed') {
            hide_media_icons();
        }
        this.pause();
    }
};

var show_video = function(mov_img) {

    if (folders[chapter].data[folders[chapter].last_position].video.src == '' || video_controls.act_src != mov_img) {

        folders[chapter].data[folders[chapter].last_position].video.src = video_controls.act_src = mov_img;

        document.getElementById("hg_media").innerHTML = '<video id="actual_video"/ ><source src="images/' + folders[chapter].name + '/' + mov_img + '.mp4" type="video/mp4" ></video>';

        vid = document.getElementById("actual_video");

        vid.autoplay = false;

    }

    video_controls.run();

    fade_mov("hg_media", "in");

};

fade_mov = function(over, dir) {

    var over = document.getElementById(over);

    if (dir == 'out') {

        sh_epi();

        over.classList.remove('change_img_in');
        over.classList.add('change_img_out');

    } else {

        size_video();

        over.classList.remove('change_img_out');
        over.classList.add('change_img_in');

        document.getElementsByClassName('fa-angle-left')[0].style.display = document.getElementsByClassName('fa-angle-right')[0].style.display = 'none';
        hide_media_icons();

        document.getElementsByClassName('fa-pause')[folders[chapter].last_position].style.display = document.getElementsByClassName('fa-expand')[folders[chapter].last_position].style.display = 'inline-block';

        document.getElementsByClassName('fa-volume-up')[folders[chapter].last_position].style.display = (vid.muted) ? 'inline-block' : 'none';
        document.getElementsByClassName('fa-volume-off')[folders[chapter].last_position].style.display = (vid.muted) ? 'none' : 'inline-block';

    }

};


size_video = function() {

    //vid.width = vid.height = 'auto';
    vid.aspectRatio = vid.offsetWidth / vid.offsetHeight;


    //vid.parentNode.style.left = 0;
    //vid.parentNode.style.top = 180 + 'px';


    //if (vid.aspectRatio > window.innerWidth / (window.innerHeight - parseInt(180 * window.innerWidth / window.innerHeight))) {
    if (vid.aspectRatio > window.innerWidth / (window.innerHeight - 180)) {

        vid.style.width = "auto";

        vid.style.height = "100%";

        //console.log('w: ', vid.offsetWidth, window.innerWidth);
        /*
                    var l = parseInt(0 - (vid.offsetWidth - vid.parentNode.offsetWidth) / 2);

                    if (l < 0) {
                        vid.parentNode.style.left = l + 'px';
                    }
        */
    } else {

        vid.style.width = "100%";

        vid.style.height = "auto";

        //console.log('h: ', vid.offsetHeight, window.innerHeight);

        /*

                    var r = parseInt(0 - (vid.offsetHeight - vid.parentNode.offsetHeight) / 2);
                    if (r < 0) {
                        vid.parentNode.style.top = r + 180 + 'px';
                    }
        */
    }


};

hide_media_icons = function() {

    //console.log('hide_media_icons');

    var fa = document.getElementsByClassName('fa-pause');

    for (var i = 0; i < fa.length; i++) {

        fa[i].style.display = fa[i].nextSibling.style.display = fa[i].nextSibling.nextSibling.style.display = fa[i].nextSibling.nextSibling.nextSibling.style.display = fa[i].nextSibling.nextSibling.nextSibling.nextSibling.style.display = 'none';

    }

    if (media_kind == 'a') {
        if (aud.paused) {
            document.getElementsByClassName('fa-pause')[folders[chapter].last_position].style.display = 'none';
            document.getElementsByClassName('fa-play')[folders[chapter].last_position].style.display = 'inline-block';
        } else {
            document.getElementsByClassName('fa-pause')[folders[chapter].last_position].style.display = 'inline-block';
            document.getElementsByClassName('fa-play')[folders[chapter].last_position].style.display = 'none';
        }
    }


};

var aud = '';
var media_kind = 'v';

hear_audio = function(f, aud_img) {


    document.getElementById("hg_audio").innerHTML = '<audio id="actual_audio" ><source src="' + f + '/' + aud_img + '.mp3" type="audio/mpeg" ></audio>';

    media_kind = 'a';

    aud = document.getElementById("actual_audio");

    aud.play();

    //aud.loop = true;

    //vid.muted = false;

    hide_media_icons();


};

var jump_to = function(j, i) {
    jump_destination = false;
    document.getElementById("chapter_menu").style.display = 'none';

    folders[i].last_position = j;

    if (i == chapter) {
        hit_menue(i, -1);
        return;
    }

    hit_menue(i);


};

var hit_menue = function(t, ju) {


    found.classList.remove('found_in_out');

    found.style.display = 'none';


    var old_scroll_pos = folders[chapter].last_position;

    var a = document.getElementsByClassName('items');


    if (!isNaN(t)) {
        t = document.getElementsByClassName('items')[t];
    }

    for (var i = 0; i < a.length; i++) {

        a[i].style.color = '#333';

        if (a[i] == t) {

            if (isTouchSupported()) {

                disable_cine = true;

            }

            old_chapter = (typeof ju === 'undefined') ? chapter : ju;

            /*

            console.log(history.state);

            //var last_page_ix = folders[chapter].last_position;

            history.pushState({
                    "current_page": folders[i].data[folders[i].last_position].comp_name,
                    "previous_page": folders[chapter].data[old_scroll_pos].comp_name
                }, 'Page: About me',
                '?' + folders[i].data[folders[i].last_position].comp_name);

            console.log(history.state);

*/




            chapter = i;


            a[chapter].style.color = '#bc123a';

            if (typeof ju === 'undefined') {

                var cap_ih = '';


                for (var aus = 0; aus < folders[chapter].data.length; aus++) {

                    cap_ih += inhalt(folders[chapter].data, aus);

                }

                document.getElementById('chapter_content').style.height = get_page_scroll_position() + window.innerHeight + 'px';

                document.getElementById("chapter_content").innerHTML = cap_ih;

                //doc = new jsPDF();

            }

        }
    }

    document.getElementById("hg_cover").style.display = 'block';

    var uat = document.getElementsByClassName('ueandtx');

    for (var i = 0; i < uat.length; i++) {

        if (typeof folders[chapter].data[i].slid_count === 'undefined') {
            folders[chapter].data[i].slid_count = 0;
        }

        if (typeof folders[chapter].data[i].see_read_state === 'undefined') {
            folders[chapter].data[i].see_read_state = 0;
        }

    }

    toggle_favicons();

    //	preload_images

    if (typeof folders[chapter].data[0].bilder === 'undefined') {


        for (var i = 0; i < uat.length; i++) {
            folders[chapter].data[i].bilder = [];
        }

        //	wait a while ontill preload_images is done

        clearInterval(foimId);

        foimId = setInterval(function() {

            if (preload_images.folder_imgs == true) {

                clearInterval(foimId);

                preload_images.folder_imgs = false;

                document.getElementsByClassName('scroll_positioner')[folders[chapter].last_position].scrollIntoView({
                    block: "start",
                    behavior: "smooth"
                });

                if (folders[chapter].last_position == old_scroll_pos) {


                    change_image(folders[chapter].data[folders[chapter].last_position].comp_name + '_' + folders[chapter].data[folders[chapter].last_position].slid_count);

                }

                setTimeout(function() {
                    display_prel.classList.remove('preloaded_on');
                    display_prel.classList.add('preloaded_off');
                }, 1000);

            }

        }, 100);

        display_prel.classList.remove('preloaded_ini');
        display_prel.classList.remove('preloaded_off');
        display_prel.classList.add('preloaded_on');

        preload_images.get_arrays('sub', folders[chapter], 'name');

    } else {

        document.getElementsByClassName('scroll_positioner')[folders[chapter].last_position].scrollIntoView({
            block: "start",
            behavior: "smooth"
        });

        if (folders[chapter].last_position == old_scroll_pos) {

            change_image(folders[chapter].data[folders[chapter].last_position].comp_name + '_' + folders[chapter].data[folders[chapter].last_position].slid_count);

        }
    }

    document.getElementById("header_txt").innerHTML = folders[chapter].intro;


};

var see = function(t, s, p) {

    var i = t.ix;

    folders[chapter].data[i].see_read_state = s;

    //	image commes

    if (s == 1) {

        if (isTouchSupported()) {

            disable_cine = false;

        }

        t.style.display = 'none';
        t.nextSibling.style.display = 'inline-block';
        t.parentNode.style.marginTop = '-42px';
        t.parentNode.parentNode.style.fontSize = '3.6vw';
        t.parentNode.parentNode.style.textIndent = '40px';
        t.parentNode.parentNode.style.background = 'rgba(191, 191, 191, 0.6)';
        t.parentNode.parentNode.style.marginTop = '180px';
        t.parentNode.parentNode.style.borderTop = '18px solid rgba(0, 0, 0, 0)';
        if (t.parentNode.parentNode.nextSibling.nextSibling) {
            t.parentNode.parentNode.nextSibling.nextSibling.style.visibility = 'hidden';
        }
        t.parentNode.parentNode.nextSibling.style.visibility = 'hidden';
        t.parentNode.parentNode.parentNode.style.background = 'rgba(255,255,255,0)';

        t.parentNode.parentNode.parentNode.style.height = parseInt(window.innerHeight - 60) + 'px';
        //t.parentNode.parentNode.parentNode.style.marginTop = '0px';
        document.getElementsByClassName('scroll_positioner')[i].style.marginTop = p + 'px';

        if (folders[chapter].data[i].video) {

            //console.log('playstate from see: ' + folders[chapter].data[i].video.playstate);

        }

        if (folders[chapter].data[i].epilog.Impressionen && !isTouchSupported() && folders[chapter].data[i].video.playstate == 'closed') {

            //console.log('oki block');

            document.getElementsByClassName('fa-angle-left')[0].style.display = document.getElementsByClassName('fa-angle-right')[0].style.display = 'block';

        }

        sh_cheese(t.parentNode.parentNode.parentNode, 0);


    } else {

        //	text commes

        if (isTouchSupported()) {

            disable_cine = true;

        }

        t.style.display = 'none';
        t.previousSibling.style.display = 'inline-block';
        t.parentNode.style.marginTop = '-36px';
        t.parentNode.parentNode.style.fontSize = '28px';
        t.parentNode.parentNode.style.textIndent = 0;
        t.parentNode.parentNode.style.background = 'rgba(0, 0, 0, 0)';
        t.parentNode.parentNode.style.marginTop = '0';
        t.parentNode.parentNode.style.borderTop = '0 none';

        t.parentNode.parentNode.nextSibling.style.visibility = 'visible';

        t.parentNode.parentNode.nextSibling.style.filter = 'none';
        t.parentNode.parentNode.nextSibling.style.color = '#333';

        if (t.parentNode.parentNode.nextSibling.nextSibling) {
            t.parentNode.parentNode.nextSibling.nextSibling.style.visibility = 'visible';
        }

        t.parentNode.parentNode.parentNode.style.background = 'rgba(255,255,255,0.9)';

        t.parentNode.parentNode.parentNode.style.height = 'auto';

        if (t.parentNode.parentNode.parentNode.offsetHeight < parseInt((window.innerHeight - 300) / 2)) {
            t.parentNode.parentNode.parentNode.style.height = parseInt((window.innerHeight - 300) / 2) + 'px';
        }

        document.getElementsByClassName('scroll_positioner')[i].style.marginTop = 'calc(180px - 50vh)';

        window.scrollTo(0, t.parentNode.parentNode.parentNode.previousSibling.offsetTop);

        document.getElementsByClassName('fa-angle-left')[0].style.display = document.getElementsByClassName('fa-angle-right')[0].style.display = 'none';


        if (app_display_data.act_app == folders[chapter].data[i].comp_name) {

            sh_cheese(t.parentNode.parentNode.parentNode, 0);

        } else {

            sh_cheese(t.parentNode.parentNode.parentNode, 1);

        }

        /*

        console.log(folders[chapter].data[i]);

        sh_cheese(t.parentNode.parentNode.parentNode, 1);
        */

    }



};



var sh_cheese = function(t, sh) {
    //console.log(sh);

    if (!t.getElementsByClassName('cheese')[0]) {
        //t.style.background = 'rgba(255,255,255,0.9)';
        //console.log('ireturn from cheese');
        return;
    }

    // cheese commes

    if (sh == 1) {
        if (folders[chapter].data[folders[chapter].last_position].imp_cheese_state) {
            t.style.background = 'rgba(0,0,0,0)';
            if (folders[chapter].data[folders[chapter].last_position].see_read_state == 0) {
                t.getElementsByClassName('cheese')[0].style.display = 'block';
                var x = window.innerWidth - 260;
                var y = calc_min_slid_height(t.getElementsByClassName('epilog')[0].children.length);
                draw_cheese_canvas(t.getElementsByClassName('cheese')[0], x, y);
            }
            if (t.getElementsByClassName('imp_slid')[0]) {
                t.getElementsByClassName('imp_slid')[0].style.WebkitAnimationPlayState = 'running';
                t.getElementsByClassName('imp_slid')[0].style.animationPlayState = 'running';
            }
        }

        // cheese goes

    } else {

        if (folders[chapter].data[folders[chapter].last_position].see_read_state == 0) {
            t.style.background = 'rgba(255,255,255,0.9)';
        }
        t.getElementsByClassName('cheese')[0].style.display = 'none';
        if (t.getElementsByClassName('imp_slid')[0]) {
            t.getElementsByClassName('imp_slid')[0].style.WebkitAnimationPlayState = 'paused';
            t.getElementsByClassName('imp_slid')[0].style.animationPlayState = 'paused';
        }
    }

};


var toggle_favicons = function() {

    var fa_dol = document.getElementsByClassName('fa-download');

    var fa_img = document.getElementsByClassName('fa-eye');
    var fa_txt = document.getElementsByClassName('fa-file-text-o');

    var fa_pause = document.getElementsByClassName('fa-pause');
    var fa_play = document.getElementsByClassName('fa-play');

    var fa_mute = document.getElementsByClassName('fa-volume-off');
    var fa_unmute = document.getElementsByClassName('fa-volume-up');

    var fa_exp = document.getElementsByClassName('fa-expand');

    for (var i = 0; i < fa_img.length; i++) {

        fa_dol[i].ix = fa_img[i].ix = fa_txt[i].ix = fa_mute[i].ix = fa_unmute[i].ix = i;

        fa_dol[i].style.visibility = (chapter == 0) ? 'hidden' : 'visible';

        fa_dol[i].addEventListener('click', function() {


            if (confirm('Möchten Sie das PDF Datenblatt von "' + folders[chapter].data[this.ix].name + '"\n(Einleitung, Ausstellungskonzept, Ausstellungsort und Datum, ohne Bilder)\nherunterladen / speichern?')) {
                download_pdf();
                return;
            }



        }, false);

        fa_img[i].addEventListener('click', function() {

            see(this, 1, -210);

            window.scrollTo(0, this.parentNode.parentNode.nextSibling.offsetTop - 102);

        }, false);

        if (folders[chapter].data[i].see_read_state == 1) {

            see(fa_img[i], 1, -26);

        }

        fa_txt[i].addEventListener('click', function() {

            see(this, 0);
            folders[chapter].data[folders[chapter].last_position].video.playstate = 'closed';
            video_controls.hide();

        }, false);

        fa_pause[i].addEventListener('click', function() {

            this.style.display = 'none';
            this.nextSibling.style.display = 'inline-block';
            if (media_kind == 'v') {
                folders[chapter].data[folders[chapter].last_position].video.playstate = 'open';
                video_controls.pause();
            } else {
                folders[chapter].data[folders[chapter].last_position].audio.time = aud.currentTime;
                aud.pause();
            }

        }, false);

        fa_play[i].addEventListener('click', function() {

            this.style.display = 'none';
            this.previousSibling.style.display = 'inline-block';
            if (media_kind == 'v') {
                folders[chapter].data[folders[chapter].last_position].video.playstate = 'open';
                video_controls.run();
            } else {
                aud.play();
            }

        }, false);

        fa_mute[i].addEventListener('click', function() {

            if (vid != '') {
                this.style.display = 'none';
                this.nextSibling.style.display = 'inline-block';
                vid.muted = true;
            }

        }, false);

        fa_unmute[i].addEventListener('click', function() {

            if (vid != '') {
                this.style.display = 'none';
                this.previousSibling.style.display = 'inline-block';
                vid.muted = false;
            }

        }, false);

        fa_exp[i].addEventListener('click', function() {

            if (vid != '') {
                //this.style.display = 'none';
                //this.previousSibling.style.display = 'inline-block';
                ////console.log('expand!');
                toggleFullScreen();
            }

        }, false);
    }

};

var slide_lr = function(d, f) {

    if (folders[chapter].data[folders[chapter].last_position].video.playstate != 'closed' || folders[chapter].data[folders[chapter].last_position].comp_name == 'bestellen') {
        return;
    }

    if (folders[chapter].data[folders[chapter].last_position].see_read_state == 0) {

        var el = document.getElementsByClassName('fa-eye')[folders[chapter].last_position];
        el.ix = folders[chapter].last_position;

        ////console.log('error? ' + d + ' error? ' + f + ' error? ' + el);

        see(el, 1, -210);

        window.scrollTo(0, el.parentNode.parentNode.nextSibling.offsetTop - 102);

    }
    if (d == -1) {

        folders[chapter].data[folders[chapter].last_position].slid_count--;


        if (folders[chapter].data[folders[chapter].last_position].slid_count < 0) {

            folders[chapter].data[folders[chapter].last_position].slid_count = bilder()[folders[chapter].last_position].length;

        }

    } else {

        if (d > 1 || f) {

            folders[chapter].data[folders[chapter].last_position].slid_count = d;

            change_image(folders[chapter].data[folders[chapter].last_position].comp_name + '_' + d);

            return;

        }

        folders[chapter].data[folders[chapter].last_position].slid_count++;

        if (folders[chapter].data[folders[chapter].last_position].slid_count > bilder()[folders[chapter].last_position].length) {

            folders[chapter].data[folders[chapter].last_position].slid_count = 0;

        }

    }

    change_image(folders[chapter].data[folders[chapter].last_position].comp_name + '_' + folders[chapter].data[folders[chapter].last_position].slid_count);

};

var search_nostyle = function(t) {

    var ini = false;

    if (typeof t == 'string') {

        var toSearch = t.toLowerCase().replace(/ /g, '');

        ini = true;

    } else {

        var toSearch = t.innerHTML.toLowerCase().replace(/ /g, '').replace('(palma3)', '');

    }

    top_loop: for (var f = 0; f < folders.length; f++) {

        for (var i = 0; i < folders[f].data.length; i++) {

            for (key in folders[f].data[i]) {

                if (folders[f].data[i].search.indexOf(toSearch) != -1) {

                    if (ini) {

                        ini = false;

                        var a = [i, f];

                        return a;

                    } else {

                        jump_to(i, f);

                    }

                    break top_loop;

                }
            }
        }

    }

    if (ini) {

        //console.log('here i am with nothing in my hands');
        var a = [0];
        return a;

    }

};

var search = function(t) {

    t.parentNode.style.border = '2px solid #bc123a';

    t.nextSibling.nextSibling.style.display = 'none';
    t.nextSibling.style.display = 'none';

    found.classList.remove('found_in_out');

    found.style.display = 'none';

    var toSearch = t.value.toLowerCase().replace(/ /g, '');

    top_loop: for (var f = 0; f < folders.length; f++) {

        for (var i = 0; i < folders[f].data.length; i++) {

            for (key in folders[f].data[i]) {

                if (folders[f].data[i].search.indexOf(toSearch) != -1) {

                    if (f > 0) {

                        found.innerHTML = '<a onclick="jump_to(' + i + ', ' + f + ');">' + folders[f].data[i].name + '</a>';

                        var s_ref = document.getElementsByClassName('items')[f];

                        found.style.display = 'block';

                        found.style.left = s_ref.getBoundingClientRect().left + s_ref.offsetWidth / 2 - found.offsetWidth / 2 + 'px';
                        found.classList.add('found_in_out');

                    }


                    t.parentNode.style.border = '2px solid rgba(127, 127, 127, 0.2)';

                    t.nextSibling.nextSibling.style.display = 'inline-block';
                    t.nextSibling.style.display = 'inline-block';
                    t.nextSibling.nextSibling.ix = i;
                    t.nextSibling.nextSibling.fx = f;
                    t.nextSibling.nextSibling.onclick = function() {
                        jump_to(this.ix, this.fx);
                    };

                    jump_destination = [i, f];

                    break top_loop;

                }
            }
        }

    }
};

var jump_destination = false;

var arrow = function(e) {

    if (document.getElementById("chapter_menu").style.display != 'none') {
        //return;
    }

    if (!e) {

        e = window.event;

    }

    if (e.keyCode == 37) {

        slide_lr(-1);

    }

    if (e.keyCode == 39) {

        slide_lr(1);

    }

    if (jump_destination && e.keyCode == 13) {

        jump_to(jump_destination[0], jump_destination[1]);

    }
};

var text_load = function() {

    loadXMLDoc('inhalt.js', function() { // call entry creator machine on server

        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {

                folders = JSON.parse(xmlhttp.responseText).folders;

                page_load();

            } else {
                alert('inhalt shit happens');
            }
        }
    });

};


var page_load = function() {

    wlh = window.location.href;

    display_prel = document.getElementById('preloaded');

    found = document.getElementById('found');



    for (var f = 0; f < folders.length; f++) {

        for (var s = 0; s < folders[f].data.length; s++) {

            folders[f].data[s].video = {
                "time": 0,
                "playstate": "closed",
                "mutestate": "unmuted",
                "src": ""
            };

            folders[f].data[s].audio = {
                "time": 0,
                "src": ""
            };

            //		push only comp_name

            folders[f].data[s].search.push(folders[f].data[s].comp_name);

            if (folders[f].data[s].name.toLowerCase().replace(/ /g, '') != folders[f].data[s].comp_name) {

                //		push both

                folders[f].data[s].search.push(folders[f].data[s].name.toLowerCase().replace(/ /g, ''));

            }
        }

        if (typeof folders[f].data[0].time !== 'undefined') {

            folders[f].data.sort(function(a, b) {

                return b.time.from[2] - a.time.from[2];

            })
        }

        var a = document.createElement('div');

        a.className = 'items';

        a.ix = f;

        a.innerHTML = folders[f].menu_name;

        a.addEventListener('click', function() {

            hit_menue(this);

        }, false);

        folders[f].menu_ih = '<span style="display:inline-block;">';

        folders[f].menu_ih += (f == 0) ? '<p><input type="text" onkeyup="search(this)" placeholder=" ... in Palma3 suchen" /><i class="fa fa-check search_check" aria-hidden="true"></i><i class="fa fa-arrow-circle-right" aria-hidden="true"></i></p>' : '';


        for (var mi = 0; mi < folders[f].data.length; mi++) {

            folders[f].menu_ih += '<p onclick="jump_to(' + mi + ',' + f + ')">' + folders[f].data[mi].name + '</p>';

        }

        folders[f].menu_ih += '</span>';

        a.addEventListener('mouseover', function() {

            var cm = document.getElementById("chapter_menu");

            cm.innerHTML = folders[this.ix].menu_ih;

            if (folders[this.ix].menu_ih != '') {

                cm.style.display = 'block';

                var last_p_bottom = cm.children[0].lastElementChild.getBoundingClientRect().bottom;

                if (last_p_bottom > window.innerHeight - 210) {

                    cm.children[0].style.maxHeight = window.innerHeight - 210 + 'px';
                    cm.children[0].style.overflowY = 'scroll';

                }

                var ml = parseInt(this.getBoundingClientRect().left - cm.offsetWidth / 2 + this.offsetWidth / 2);

                cm.style.marginLeft = (ml > 0) ? ml + 'px' : '0';

            }

            if (this.ix == 0) {
                cm.children[0].children[0].children[0].focus();
            }

        }, false);
        /*
                a.addEventListener('mouseout', function() {

                    document.getElementById("chapter_menu").style.display = 'none';


                }, false);
        */
        document.getElementById('content').appendChild(a);

        document.getElementById('chapter_content').addEventListener('mouseover', function() {

            document.getElementById("chapter_menu").style.display = 'none';

        }, false);

        folders[f].last_position = 0;

    }


    document.getElementById("chapter_menu").addEventListener('mouseout', function(event) {

        e = event.toElement || event.relatedTarget;

        if (e == null || e.parentNode.parentNode.parentNode == this || e.parentNode.parentNode == this || e.parentNode == this || e == this) {

            return;

        }

        this.style.display = 'none';

    }, false);

    window.addEventListener("resize", align_onresize, false);

    window.addEventListener("scroll", white_head, false);

    document.getElementById('header_palma').addEventListener("click", page_reload, false);

    document.getElementsByClassName('fa-angle-left')[0].addEventListener('click', function() {

        slide_lr(-1);

    }, false);

    document.getElementsByClassName('fa-angle-right')[0].addEventListener('click', function() {

        slide_lr(1);

    }, false);

    if (isTouchSupported()) {

        get_cine_script();

        return;

    } else {

        window.addEventListener("keydown", arrow, false);

    }

    preload_images.get_arrays('kind', folders, 'name');

};

document.addEventListener('DOMContentLoaded', text_load, false);

/*
window.onpopstate = function(event) {
    console.log(history.state);
};
*/
