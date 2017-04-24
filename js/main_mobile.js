var disable_cine = true;

var sivId, fadeinmovId, foimId, speedId;

var wlh, folders;


var align_onresize = function() {

    //		imediate

    var cm = document.getElementById("chapter_menu");

    if (cm && cm.style.display == 'block') {

        cm.style.display = 'none';

    }

    //		after a while

    clearTimeout(resizeId);

    resizeId = setTimeout(function() {

        var c = document.getElementsByClassName("tx");

        for (var i = 0; i < c.length; i++) {

            c[i].style.WebkitColumnCount = c[i].style.MozColumnCount = c[i].style.columnCount = get_column_count(folders[chapter].data[i]).replace('column-count:', '');

        }

        jump_to(folders[chapter].last_position, chapter);

    }, 200);

};


var get_column_count = function() {


    return 'column-count:1';

};


var inhalt = function(c, i) {

    var r = '';

    r += '<span class="scroll_positioner"></span><span class="ueandtx">' + '<span class="ue">' + c[i].name;
    r += (c[i].time) ? ' - ' + adjustments_de.monthNames[c[i].time.from[1] - 1] + ' ' + c[i].time.from[2] : '';
    r += (c[i].published) ? ' - ' + c[i].published.year : '';

    var cs = get_column_count();

    var favicons = '' +

        '<i class="fa fa-download" aria-hidden="true"></i>' +

        '<i class="fa fa-pause" aria-hidden="true"></i>' +

        '<i class="fa fa-play" aria-hidden="true"></i>' +

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


        insert = ['<div id="palma_form"></div>', '<div></div>'];


    }

    var ins_ts = (insert.length == 2) ? ['', ''] : [insert[2], insert[3]];

    r += (c[i].prolog == '') ? insert[0] : insert[0] + '<h2' + ins_ts[0] + '>' + c[i].prolog + '</h2>' + ins_ts[1];

    r += c[i].text + insert[1] + '</span>';

    r += '</span>';

    return r;

};

var change_image = function(img) {


    img = img.replace('_0', '');

    var test_imageObj = new Image();

    test_imageObj.onerror = function() {

        change_image('default');

        return;

    };

    test_imageObj.onload = function() {

        document.getElementById("hg_cover").style.backgroundImage = 'url("' + img_type.path + folders[chapter].name + '/' + img + img_type.ext + '")';

        fade_img("hg_cover", "hg");

    };

    test_imageObj.src = img_type.path + folders[chapter].name + '/' + img + img_type.ext;

};

var see = function(t, s, p) {

    var i = t.ix;

    folders[chapter].data[i].see_read_state = s;

    //	image commes

    if (s == 1) {


        disable_cine = false;


        t.style.display = 'none';
        t.nextSibling.style.display = 'inline-block';
        t.parentNode.style.marginTop = '-42px';
        t.parentNode.parentNode.style.fontSize = '3.6vw';
        t.parentNode.parentNode.style.textIndent = '40px';
        t.parentNode.parentNode.style.background = 'rgba(191, 191, 191, 0.6)';

        //if (window.innerWidth > 950) {

        //t.parentNode.parentNode.style.marginTop = '180px';

        //}
        t.parentNode.parentNode.style.borderTop = '18px solid rgba(0, 0, 0, 0)';
        if (t.parentNode.parentNode.nextSibling.nextSibling) {
            t.parentNode.parentNode.nextSibling.nextSibling.style.visibility = 'hidden';
        }
        t.parentNode.parentNode.nextSibling.style.visibility = 'hidden';
        t.parentNode.parentNode.parentNode.style.background = 'rgba(255,255,255,0)';

        t.parentNode.parentNode.parentNode.style.height = parseInt(window.innerHeight - 60) + 'px';
        //t.parentNode.parentNode.parentNode.style.marginTop = '0px';
        document.getElementsByClassName('scroll_positioner')[i].style.marginTop = p + 'px';





    } else {

        //	text commes


        disable_cine = true;


        t.style.display = 'none';
        t.previousSibling.style.display = 'inline-block';
        t.parentNode.style.marginTop = '-36px';
        t.parentNode.parentNode.style.fontSize = '28px';
        t.parentNode.parentNode.style.textIndent = 0;
        t.parentNode.parentNode.style.background = 'rgba(141, 170, 212, 1)';
        //t.parentNode.parentNode.style.marginTop = '0';
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



    }



};



var toggle_favicons = function() {

    var fa_dol = document.getElementsByClassName('fa-download');

    var fa_img = document.getElementsByClassName('fa-eye');
    var fa_txt = document.getElementsByClassName('fa-file-text-o');

    for (var i = 0; i < fa_img.length; i++) {

        fa_dol[i].ix = fa_img[i].ix = fa_txt[i].ix = i;

        if (chapter == 0) {

            fa_dol[i].style.visibility = 'hidden';

        } else {

            fa_dol[i].style.visibility = 'visible';

            fa_dol[i].addEventListener('touchend', function() {

                if (confirm('Möchten Sie das PDF Dossier über "' + folders[chapter].data[this.ix].name + '"\nherunterladen und speichern?')) {
                    select_pdf.get_scr(this.ix);
                }

            }, false);

        }

        fa_img[i].addEventListener('touchend', function() {

            see(this, 1, -210);

        }, false);

        if (folders[chapter].data[i].see_read_state == 1) {

            see(fa_img[i], 1, -26);

        }

        fa_txt[i].addEventListener('touchend', function() {

            see(this, 0);

        }, false);

    }

};

var slide_lr = function(d, f) {

    if (folders[chapter].data[folders[chapter].last_position].comp_name == 'bestellen') {
        return;
    }

    if (folders[chapter].data[folders[chapter].last_position].see_read_state == 0) {

        var el = document.getElementsByClassName('fa-eye')[folders[chapter].last_position];
        el.ix = folders[chapter].last_position;

        ////console.log('error? ' + d + ' error? ' + f + ' error? ' + el);

        see(el, 1, -210);


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


var get_page_scroll_position = function(el) {

    var h;

    if (document.body.scrollTop) {
        //console.log('dbs: ' + document.body.scrollTop);
        h = document.body.scrollTop;
    } else {
        //console.log('ddEs: ' + document.documentElement.scrollTop);
        h = document.documentElement.scrollTop;
    }


    //console.log(h);
    console.log(0 - el.getBoundingClientRect().top);
    //var b = document.getElementsByTagName('body')[0];
    //console.log(b.scrollTop, b.offsetTop, b.getBoundingClientRect().top);


    return 0 - el.getBoundingClientRect().top;
};

var white_head = function() {

    clearTimeout(sivId);

    sivId = setTimeout(function() {

        var h = get_page_scroll_position(document.getElementById('chapter_content'));

        var uat = document.getElementsByClassName('ueandtx');

        var midpoints = [];

        for (var i = 0; i < uat.length; i++) {

            var pre_point = parseInt(uat[i].offsetTop + 210 + uat[i].offsetHeight / 2);

            switch (true) {
                case (pre_point < h + 210):
                    midpoints.push(uat[i].offsetTop + uat[i].offsetHeight);
                    break;
                case (pre_point > h + 210 + window.innerHeight):
                    midpoints.push(uat[i].offsetTop + parseInt((window.innerHeight - 210) / 2));
                    break;
                default:
                    midpoints.push(pre_point);

            }

        }


        var g = getNearestNumber(midpoints, h + window.innerHeight / 2 + 240);

        //console.log(h, midpoints);

        if (folders[chapter].last_position == g && chapter == old_chapter) {
            console.log('(disabled) ireturn in middle of white_head');
            return;
        }

        old_chapter = chapter;

        folders[chapter].last_position = g;

        document.getElementById('chapter_content').style.height = 'auto';

        change_image(folders[chapter].data[folders[chapter].last_position].comp_name + '_' + folders[chapter].data[folders[chapter].last_position].slid_count);

        //document.documentElement.webkitRequestFullscreen();

    }, 100);

};

var fade_img = function(over, under) {

    var over = document.getElementById(over);

    over.classList.add('change_img_in');

    setTimeout(function() {

        document.getElementById(under).style.backgroundImage = over.style.backgroundImage;

        over.classList.remove('change_img_in');

    }, 400);

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

            disable_cine = true;

            old_chapter = (typeof ju === 'undefined') ? chapter : ju;




            chapter = i;


            a[chapter].style.color = '#bc123a';

            //if (typeof ju === 'undefined') {

            var cap_ih = '';


            for (var aus = 0; aus < folders[chapter].data.length; aus++) {

                cap_ih += inhalt(folders[chapter].data, aus);

            }

            document.getElementById('chapter_content').style.height = get_page_scroll_position(document.getElementById('chapter_content')) + window.innerHeight + 'px';

            document.getElementById("chapter_content").innerHTML = cap_ih;

            //doc = new jsPDF();

            //}

        }
    }

    document.getElementById("hg_cover").style.display = 'block';
    var uat = document.getElementsByClassName('ueandtx');

    for (var i = 0; i < uat.length; i++) {

        if (typeof folders[chapter].data[i].slid_count === 'undefined') {
            folders[chapter].data[i].slid_count = 0;
        }

        if (typeof folders[chapter].data[i].see_read_state === 'undefined') {
            folders[chapter].data[i].see_read_state = 1;
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

            }

        }, 100);


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


var start_cine = function() {

    var t = document.getElementById('hg_cover');


    window.addEventListener('touchstart', function() {
        if (disable_cine == false) {
            get_mouse_coords(t);
        }
    }, false);

    window.addEventListener('touchmove', function() {
        if (disable_cine == false) {
            check_swipe(t);
        }
    }, false);

    window.addEventListener('touchend', function() {
        if (disable_cine == false) {
            swap_now(t);
        }
    }, false);


};


var get_cine_script = function() {

    loadXMLDoc('js/cinema.js', function() {

        if (xmlhttp.readyState == 4) {

            if (xmlhttp.status == 200) {

                var s = document.createElement('script');

                s.setAttribute("type", "text/javascript");

                s.setAttribute("charset", "utf-8");

                s.innerHTML = xmlhttp.responseText;

                s.onload = function() {

                    start_cine();

                    preload_images.get_arrays('kind', folders, 'name');


                };

                s.src = 'js/cinema.js';

                document.getElementsByTagName('head')[0].appendChild(s);


            } else {

                console.log('get_cine_script shit happens');

            }
        }

    });

};

var page_load = function() {

    wlh = window.location.href;

    display_prel = document.getElementById('preloaded');

    found = document.getElementById('found');

    document.body.removeChild(document.getElementsByClassName('fa-angle-left')[0]);
    document.body.removeChild(document.getElementsByClassName('fa-angle-right')[0]);



    for (var f = 0; f < folders.length; f++) {

        for (var s = 0; s < folders[f].data.length; s++) {

            /*

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

            */

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

        /*

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
                */

        document.getElementById('content').appendChild(a);

        document.getElementById('chapter_content').addEventListener('mouseover', function() {

            document.getElementById("chapter_menu").style.display = 'none';

        }, false);

        folders[f].last_position = 0;

    }

    /*
        document.getElementById("chapter_menu").addEventListener('mouseout', function(event) {

            e = event.toElement || event.relatedTarget;

            if (e == null || e.parentNode.parentNode.parentNode == this || e.parentNode.parentNode == this || e.parentNode == this || e == this) {

                return;

            }

            this.style.display = 'none';

        }, false);

    */

    //window.addEventListener("resize", align_onresize, false);

    document.getElementsByTagName('body')[0].addEventListener("scroll", white_head, false);

    //document.getElementById('header_palma').addEventListener("click", page_reload, false);



    get_cine_script();


    //preload_images.get_arrays('kind', folders, 'name');

};
