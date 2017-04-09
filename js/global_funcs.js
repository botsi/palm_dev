var adjustments_de = {

    dayNames: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    dayNamesMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    monthNames: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    monthNamesMin: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
    years: []

};

var isTouchSupported = function() {

    var msTouchEnabled = window.navigator.msMaxTouchPoints;

    var generalTouchEnabled = "ontouchstart" in document.createElement("div");

    if (msTouchEnabled || generalTouchEnabled) {

        return true;

    }

    return false;
};

var check_webp_feature = function(feature, callback) {

    var kTestImages = {
        lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
        lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
        alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
        animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
    };
    var img = new Image();
    img.onload = function() {
        var result = (img.width > 0) && (img.height > 0);
        callback(result);
    };
    img.onerror = function() {
        callback(false);
    };
    img.src = "data:image/webp;base64," + kTestImages[feature];

};

var shop = {
    "fields": {
        "form_firma": "",
        "form_anrede": "",
        "form_vorname": "",
        "form_name": "",
        "form_strasse": "",
        "form_nr": "",
        "form_zusatzzeile": "",
        "form_plz": "",
        "form_ort": "",
        "form_land": "",
        "form_email": "",
        "form_telefon": ""
    },
    "items": [],
    "fillbasket": function() {
        console.log('ifill');

        shop.list = document.getElementById('palma_shop');

        if (shop.items.length > 0) {

            for (var i = 0; i < shop.items.length; i++) {

                for (var psi = 0; psi < shop.list.children.length; psi++) {

                    if (psi == 0) {

                        if (shop.items[i].Artikel.indexOf('Terminanfrage') != -1) {

                            shop.list.children[psi].children[0].classList.remove('form_check_white');
                            shop.list.children[psi].children[0].classList.add('form_check_blue');

                            shop.list.children[psi].children[1].children[1].value = shop.items[i].Artikel.replace('Terminanfrage für ', '');

                        }

                    } else {

                        if (shop.items[i].Artikel == shop.list.children[psi].children[1].innerHTML) {

                            shop.list.children[psi].children[0].classList.remove('form_check_white');
                            shop.list.children[psi].children[0].classList.add('form_check_blue');

                            shop.list.children[psi].children[3].value = shop.items[i].Menge;

                        }
                    }

                }

            }

            shop.display();

        }

    },
    "valid": false,
    "preSendData": function() {
        if (shop.valid) {
            console.log(shop.items, shop.order_total.replace('Meine Bestellung: ', '').replace('Versandkosten: ', '').replace('Summe: ', ''), "order_sum: " + shop.order_sum);
            sendData(Object.assign({}, shop.fields, {
                "order_text": shop.order_total.replace('Meine Bestellung: ', '').replace('Versandkosten: ', '').replace('Summe: ', ''),
                "order_sum": shop.order_sum
            }));
        }
    },
    "work": function(t) {
        if (t.classList.contains('form_check_white')) {
            t.classList.remove('form_check_white');
            t.classList.add('form_check_blue');

            if (t.nextSibling.nextSibling.nextSibling.value == '') {
                t.nextSibling.nextSibling.nextSibling.value = 1;
            }

            shop.items.push({
                "Artikel": t.nextSibling.innerHTML,
                "Preis": t.nextSibling.nextSibling.id.slice(2),
                "Menge": t.nextSibling.nextSibling.nextSibling.value
            });

            console.log(shop.items);

        } else {
            t.classList.remove('form_check_blue');
            t.classList.add('form_check_white');
            t.nextSibling.nextSibling.nextSibling.value = '';

            for (var i = 0; i < shop.items.length; i++) {
                if (shop.items[i].Artikel == t.nextSibling.innerHTML) {
                    shop.items.splice(i, 1);
                    break;
                }
            }

        }

        //console.log('items: ', shop.items);
        shop.display();

    },
    "remote_add": function(t) {

        var e = false;

        for (var i = 0; i < shop.items.length; i++) {
            if (shop.items[i].Artikel == folders[chapter].data[folders[chapter].last_position].name) {
                e = true;
                break;
            }
        }
        if (!e) {
            shop.items.push({
                "Artikel": folders[chapter].data[folders[chapter].last_position].name,
                "Preis": folders[chapter].data[folders[chapter].last_position].epilog.Bestellung[2],
                "Menge": 1
            });
        }
        search_nostyle(t);
    },
    "user": function(t) {

        if (t.value.indexOf('<') != -1 || t.value.indexOf('>') != -1 || t.value.indexOf('\'') != -1 || t.value.indexOf('"') != -1 || t.value.indexOf('(') != -1 || t.value.indexOf(')') != -1 || t.value.indexOf('{') != -1 || t.value.indexOf('}') != -1 || t.value.indexOf('eval') != -1) {
            console.log('code!');
            shop.fields[t.id] = t.value = '';
            shop.valid = false;
            return;
        }


        switch (t.id) {
            case 'form_email':
                if (t.value == ' ' || t.value.indexOf('@') == -1 || t.value.indexOf('.') == -1 || t.value.length < 6 || t.value.lastIndexOf('.') + 3 > t.value.length || t.value.lastIndexOf('.') < t.value.indexOf('@')) {
                    console.log('uncomplete');
                    shop.fields[t.id] = '';
                } else {
                    shop.fields[t.id] = t.value;
                }
                break;
            case 'form_vorname':
            case 'form_name':
            case 'form_strasse':
            case 'form_ort':
                if (t.value == ' ' || t.value.length < 2) {
                    console.log('uncomplete');
                    shop.fields[t.id] = '';
                } else {
                    shop.fields[t.id] = t.value;
                }
                break;
            case 'form_plz':
                if (isNaN(t.value) || t.value.length < 4) {
                    console.log('uncomplete plz');
                    shop.fields[t.id] = '';
                } else {
                    shop.fields[t.id] = t.value;
                }
                break;
            default:
                shop.fields[t.id] = t.value;
        }

        shop.check_send_but();


    },
    "check_send_but": function() {

        if (shop.fields['form_email'] != '' && shop.fields['form_vorname'] != '' && shop.fields['form_name'] != '' && shop.fields['form_strasse'] != '' && shop.fields['form_nr'] != '' && shop.fields['form_plz'] != '' && shop.fields['form_ort'] != '') {
            shop.send_but.style.cursor = 'pointer';
            shop.send_but.style.opacity = 1;
            shop.valid = true;
        } else {
            shop.send_but.style.cursor = 'default';
            shop.send_but.style.opacity = 0.2;
            shop.valid = false;

        }

    },
    "time": function(t) {

        if (t.value == '') {

            for (var i = 0; i < shop.items.length; i++) {
                if (shop.items[i].Artikel.indexOf('Terminanfrage') != -1) {
                    shop.items.splice(i, 1);
                    break;
                }
            }

            shop.display();

            return;

        }


        if (shop.items.length == 0) {

            shop.items.push({
                "Artikel": "Terminanfrage für " + t.value,
                "Preis": "x",
                "Menge": "x"
            });

        } else {

            var ta_found = false;
            for (var i = 0; i < shop.items.length; i++) {
                if (shop.items[i].Artikel.indexOf('Terminanfrage') != -1) {
                    shop.items[i].Artikel = "Terminanfrage für " + t.value;
                    ta_found = true;
                    break;
                }
            }

            if (!ta_found) {
                shop.items.push({
                    "Artikel": "Terminanfrage für " + t.value,
                    "Preis": "x",
                    "Menge": "x"
                });
            }


        }

        shop.display();


    },
    "calc": function(t) {

        if (t.value > 20) {
            t.value = 20;
        }
        if (t.value < 1 || t.value == '') {
            t.previousSibling.previousSibling.previousSibling.classList.remove('form_check_blue');
            t.previousSibling.previousSibling.previousSibling.classList.add('form_check_white');

            t.value = '';


            for (var i = 0; i < shop.items.length; i++) {
                if (shop.items[i].Artikel == t.previousSibling.previousSibling.innerHTML) {
                    shop.items.splice(i, 1);
                    break;
                }
            }

            shop.display();

            return;

        }

        if (t.previousSibling.previousSibling.previousSibling.classList.contains('form_check_white')) {

            t.previousSibling.previousSibling.previousSibling.classList.remove('form_check_white');
            t.previousSibling.previousSibling.previousSibling.classList.add('form_check_blue');

        }

        if (shop.items.length == 0) {

            shop.items.push({
                "Artikel": t.previousSibling.previousSibling.innerHTML,
                "Preis": t.previousSibling.id.slice(2),
                "Menge": t.value
            });

        } else {

            for (var i = 0; i < shop.items.length; i++) {
                if (shop.items[i].Artikel == t.previousSibling.previousSibling.innerHTML) {
                    shop.items[i].Menge = t.value;
                    break;
                }
                // not found till yet

                if (i == shop.items.length - 1) {
                    shop.items.push({
                        "Artikel": t.previousSibling.previousSibling.innerHTML,
                        "Preis": t.previousSibling.id.slice(2),
                        "Menge": t.value
                    });
                }
            }
        }

        shop.display();


    },
    "order_div": "",
    "order_sum": 0,
    "order_total": "",
    "display": function(a) {

        if (shop.items.length == 0) {

            //	close the shop


            shop.order_total = '';
            if (shop.list.classList.contains('palma_shop_open')) {
                shop.list.classList.remove('palma_shop_open');
                shop.list.classList.add('palma_shop_close');

                shop.form.classList.remove('palma_form_open');
                shop.form.classList.add('palma_form_close');

                shop.list.previousSibling.previousSibling.style.width = 'auto';

            }
        } else {

            //	open the shop

            if (shop.list.classList.contains('palma_shop_ini') || shop.list.classList.contains('palma_shop_close')) {
                shop.list.classList.remove('palma_shop_close');
                shop.list.classList.remove('palma_shop_ini');
                shop.list.classList.add('palma_shop_open');

                shop.form.classList.remove('palma_form_close');
                shop.form.classList.add('palma_form_open');

                shop.list.previousSibling.previousSibling.style.width = '50%';

            }

            shop.order_total = 'Ihre Bestellung: <br/>';
            shop.order_sum = 0;

            for (var i = 0; i < shop.items.length; i++) {

                if (shop.items[i].Menge != 'x') {

                    shop.order_sum += parseInt(shop.items[i].Menge * shop.items[i].Preis);

                    shop.order_total += shop.items[i].Menge + ' x ' + shop.items[i].Artikel + ' à CHF ' + shop.items[i].Preis + '.00<br/>';

                } else {

                    shop.order_total += shop.items[i].Artikel + '<br/>';

                }
            }

            shop.order_total += (shop.order_sum > 0) ? 'Versandkosten: CHF 8.00<br/><hr/>' : '<br/><hr/>';

            shop.order_total += (shop.order_sum > 0) ? 'Summe: CHF ' + parseInt(shop.order_sum + 8) + '.00<br/><hr/>' : '<br/><hr/>';
        }

        shop.order_div.innerHTML = shop.order_total;

        if (a) {

            shop.items = [];

            for (var psi = 0; psi < shop.list.children.length; psi++) {

                if (psi == 0) {


                    shop.list.children[psi].children[0].classList.remove('form_check_blue');
                    shop.list.children[psi].children[0].classList.add('form_check_white');

                    shop.list.children[psi].children[1].children[1].value = '';


                } else {


                    shop.list.children[psi].children[0].classList.remove('form_check_blue');
                    shop.list.children[psi].children[0].classList.add('form_check_white');

                    shop.list.children[psi].children[3].value = '';

                }

            }

            shop.order_div.innerHTML += '... wurde registriert und eine Bestätigungs E-Mail an ' + shop.fields.form_email + ' versendet. <input onclick="shop.display()" style="background:rgba(141, 170, 212, 1);width: 120px;display: inline-block;cursor:pointer;" type="button" value="Ok" />';

            shop.inner_fields.style.display = 'none';

        } else {

            if (shop.items.length > 0) {

                shop.inner_fields.style.display = 'block';

            }

        }

    }
};

var loadForm = function() {

    console.log('loadForm', shop.items);

    if (!document.getElementById('palma_form')) {
        console.log('!document.getElementById(palma_form)');

    }

    //if (!shop.form) {

    shop.form = document.getElementById('palma_form');

    //}

    if (shop.form.innerHTML != '') {

        console.log('shop.form.innerHTML != empty ireturn');

        //	fill basket with previously added items


        shop.check_send_but();

        shop.fillbasket();

        return;

    }

    /******************************************
    https://www.html5rocks.com/de/tutorials/forms/html5forms/

		https://www.wufoo.com/html5/types/4-date.html?date=&time=03%3A15&week=2016-W07
    ******************************************/

    var f_ih = '<form>' +

        '<div id="order_sum"></div>' +

        '<textarea onchange="sh_dat.title_proc(this)" class="proj_title" rows="4" placeholder="Kurzbeschrieb"></textarea><span style="margin: 0;width:180px;display: none;"><input class="proj_vis_underlay" placeholder="PDF Datei" type="text"/><input onchange="sh_dat.file_proc(this)" class="proj_file" type="file"accept=".pdf, application/pdf"/></span>' +

        '<div id="inner_fields">' +

        '<span>' +

        '<label>Firma</label>' +

        '<input type="text" id="form_firma" name="form_firma">' +

        '</span><span>' +

        '<label>Anrede</label>' +

        '<select id="form_anrede" name="form_anrede"><option></option><option value="Frau">Frau</option><option value="Herr">Herr</option></select>' +

        '</span><span>' +

        '<label>Vorname</label>' +

        '<input type="text" id="form_vorname" name="form_vorname" class="cap" required>' +

        '</span><span>' +

        '<label>Name</label>' +

        '<input type="text" id="form_name" name="form_name" class="cap" required>' +

        '</span><span class="large prefield">' +

        '<label>Strasse</label>' +

        '<input type="text" id="form_strasse" name="form_strasse" class="cap" required>' +

        '</span><span class="small">' +

        '<label>Nr.</label>' +

        '<input type="text" id="form_nr" name="form_nr" required>' +

        '</span><span>' +

        '<label>Zusatzzeile</label>' +

        '<input type="text" id="form_zusatzzeile" name="form_zusatzzeile">' +

        '</span><span class="small prefield">' +

        '<label>PLZ</label>' +

        '<input type="text" id="form_plz" name="form_plz" required>' +

        '</span><span class="large">' +

        '<label>Ort</label>' +

        '<input type="text" id="form_ort" name="form_ort" class="cap" required>' +

        '</span><span>' +

        '<label>Land</label>' +

        '<input type="text" id="form_land" name="form_land" class="cap">' +

        '</span><span>' +

        '<label>Email</label>' +

        '<input type="email" id="form_email" name="form_email" required>' +

        '</span><span>' +

        '<label>Telefon</label>' +

        '<input type="text" id="form_telefon" name="form_telefon">' +

        '</span>' +

        '<br>' +

        //'<input type="submit" value="Bestellung / Anfrage absenden" />' +
        //'<input id="form_send" onclick="shop.preSendData()" type="button" value="Bestellung / Anfrage absenden" />' +

        '</div>' +

        '</form>';

    shop.form.innerHTML = f_ih;

    shop.order_div = document.getElementById('order_sum');

    shop.send_but = shop.form.parentNode.nextSibling.children[2]; //document.getElementById('form_send');

    shop.inner_fields = document.getElementById('inner_fields');

    console.log(shop.form.children[0].elements.length);

    for (var i = 0; i < shop.form.children[0].elements.length - 1; i++) {

        if (shop.form.children[0].elements[i].className.indexOf('proj') == -1) {

            shop.form.children[0].elements[i].value = shop.fields[shop.form.children[0].elements[i].id];

            shop.form.children[0].elements[i].addEventListener('keyup', function() {
                shop.user(this);
            }, false);

        }

    }


    //	fill basket with previously added items


    shop.check_send_but();

    shop.fillbasket();






};

var map;

var loadMap = function() {

    if (document.getElementById('map_script')) {

        map = null;

        initMap();

        return;

    }

    var script = document.createElement("script");
    script.id = "map_script";
    script.type = "text/javascript";
    script.src = "http://maps.google.com/maps/api/js?key=AIzaSyCi0JgwWx4peuLZN6b0Ng2xmW825wMj6tc&callback=initMap";
    document.body.appendChild(script);
};

var initMap = function() {
    //console.log(document.getElementById('palma_map'));
    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('palma_map'), {
        center: {
            lat: 46.9583839,
            lng: 7.4461065
        },
        mapTypeId: "terrain",
        scrollwheel: false,
        zoom: 16
    });
};


var centro_mv = {
    "element": false,
    "entrys": ["museum"],
    "entrys_txt": {
        "museum": ["1. Casa Anatta: Eingang", "6. Die anarchistische Kolonie"]
    },
    "controls": function(t, s) {

        this.status = s;

        this.element = t.parentNode.previousSibling;

        do_cords(s);

        if (this.entrys.indexOf(this.status) == -1) {
            t.parentNode.previousSibling.src = 'mediaguides/monteverita/' + this.status + '.png';
        }

    },
    "cont": function(c) {

        var basis = [0, 0, document.getElementById('centro-buttons').children[0].offsetWidth, document.getElementById('centro-buttons').children[0].offsetHeight];

        switch (c) {
            case "home":
                this[c] = {
                    "shape": "circle",
                    "coords": [
                        basis[2] * 0.29 + ',' + basis[3] * 0.28 + ',' + basis[3] * 0.1,
                        basis[2] - basis[2] * 0.29 + ',' + basis[3] * 0.28 + ',' + basis[3] * 0.1,
                        basis[2] * 0.5 + ',' + basis[3] * 0.5 + ',' + basis[3] * 0.14,
                        basis[2] * 0.29 + ',' + (basis[3] - basis[3] * 0.28) + ',' + basis[3] * 0.1,
                        basis[2] - basis[2] * 0.29 + ',' + (basis[3] - basis[3] * 0.28) + ',' + basis[3] * 0.1
                    ],
                    "ih": [
                        "centro_mv.controls(this,'center')",
                        "centro_mv.controls(this,'history')",
                        "centro_mv.controls(this,'guided')",
                        "centro_mv.controls(this,'perso')",
                        "centro_mv.controls(this,'guestbook')"
                    ]
                };
                break;
            case "center":
                this[c] = {
                    "shape": "circle",
                    "coords": [
                        basis[2] * 0.15 + ',' + basis[3] * 0.15 + ',' + basis[3] * 0.05,
                        basis[2] * 0.29 + ',' + basis[3] * 0.28 + ',' + basis[3] * 0.1,
                        basis[2] - basis[2] * 0.29 + ',' + basis[3] * 0.28 + ',' + basis[3] * 0.1,
                        basis[2] * 0.29 + ',' + (basis[3] - basis[3] * 0.28) + ',' + basis[3] * 0.1,
                        basis[2] - basis[2] * 0.29 + ',' + (basis[3] - basis[3] * 0.28) + ',' + basis[3] * 0.1
                    ],
                    "ih": [
                        "centro_mv.controls(this,'home')",
                        "do_me(app_display_data[app_display_data.act_app].img_ix[2])",
                        "do_me(app_display_data[app_display_data.act_app].img_ix[3])",
                        "do_me(app_display_data[app_display_data.act_app].img_ix[4])",
                        "do_me(app_display_data[app_display_data.act_app].img_ix[5])"
                    ]
                };
                break;
            case "history":
                this[c] = {
                    "shape": "rect",
                    "coords": [
                        basis[2] * 0.06 + ',' + basis[3] * 0.12 + ',' + basis[2] * 0.25 + ',' + basis[3] * 0.17,
                        basis[2] * 0.09 + ',' + basis[3] * 0.20 + ',' + (basis[2] * 0.48) + ',' + basis[3] * 0.48,
                        (basis[2] * 0.52) + ',' + basis[3] * 0.20 + ',' + (basis[2] - basis[2] * 0.09) + ',' + basis[3] * 0.48,

                        //basis[2] * 0.09 + ',' + basis[3] * 0.50 + ',' + (basis[2] * 0.48) + ',' + basis[3] * 0.78,
                        //(basis[2] * 0.52) + ',' + basis[3] * 0.50 + ',' + (basis[2] - basis[2] * 0.09) + ',' + basis[3] * 0.78,

                        basis[2] * 0.06 + ',' + basis[3] * 0.82 + ',' + basis[2] * 0.25 + ',' + basis[3] * 0.88
                    ],
                    "ih": [
                        "centro_mv.controls(this,'home')",
                        "centro_mv.controls(this,'guided')",
                        "centro_mv.controls(this,'epoches')",
                        //"centro_mv.controls(this,'persons')",
                        //"centro_mv.controls(this,'movements')",
                        "centro_mv.controls(this,'home')"
                    ]
                };
                break;
            case "guided":
                this[c] = {
                    "shape": "rect",
                    "coords": [
                        basis[2] * 0.06 + ',' + basis[3] * 0.12 + ',' + basis[2] * 0.25 + ',' + basis[3] * 0.17,
                        basis[2] * 0.09 + ',' + basis[3] * 0.20 + ',' + (basis[2] * 0.48) + ',' + basis[3] * 0.48,
                        (basis[2] * 0.52) + ',' + basis[3] * 0.20 + ',' + (basis[2] - basis[2] * 0.09) + ',' + basis[3] * 0.48,

                        basis[2] * 0.09 + ',' + basis[3] * 0.50 + ',' + (basis[2] * 0.48) + ',' + basis[3] * 0.78,
                        (basis[2] * 0.52) + ',' + basis[3] * 0.50 + ',' + (basis[2] - basis[2] * 0.09) + ',' + basis[3] * 0.78,

                        basis[2] * 0.06 + ',' + basis[3] * 0.82 + ',' + basis[2] * 0.25 + ',' + basis[3] * 0.88

                    ],
                    "ih": [
                        "centro_mv.controls(this,'home')",
                        "centro_mv.controls(this,'museum')",
                        "centro_mv.controls(this,'parc')",
                        "centro_mv.controls(this,'environs')",
                        "centro_mv.controls(this,'szeemann')",
                        "centro_mv.controls(this,'home')"
                    ]
                };
                break;
            case "perso":
                this[c] = {
                    "shape": "circle",
                    "coords": [
                        basis[2] * 0.15 + ',' + basis[3] * 0.15 + ',' + basis[3] * 0.05,
                        basis[2] * 0.5 + ',' + basis[3] * 0.75 + ',' + basis[3] * 0.16
                    ],
                    "ih": [
                        "centro_mv.controls(this,'home')",
                        "centro_mv.controls(this,'home')"
                    ]
                };
                break;
            case "guestbook":
                this[c] = {
                    "shape": "circle",
                    "coords": [
                        basis[2] - basis[2] * 0.1 + ',' + basis[3] * 0.1 + ',' + basis[3] * 0.1
                    ],
                    "ih": [
                        "centro_mv.controls(this,'home')"
                    ]
                };
                break;
            case "parc":
                this[c] = {
                    "shape": "circle",
                    "coords": [
                        basis[2] * 0.15 + ',' + basis[3] * 0.15 + ',' + basis[3] * 0.05,
                        basis[2] * 0.84 + ',' + basis[3] * 0.31 + ',' + basis[3] * 0.04,
                        basis[2] * 0.15 + ',' + basis[3] * 0.85 + ',' + basis[3] * 0.05
                    ],
                    "ih": [
                        "centro_mv.controls(this,'guided')",
                        "do_me(app_display_data[app_display_data.act_app].img_ix[6], 'monteverita_3')",
                        "centro_mv.controls(this,'home')"
                    ]
                };
                break;
            case "epoches":
                this[c] = {
                    "shape": "rect",
                    "coords": [
                        basis[2] * 0.06 + ',' + basis[3] * 0.12 + ',' + basis[2] * 0.25 + ',' + basis[3] * 0.17,

                        basis[2] * 0.06 + ',' + basis[3] * 0.82 + ',' + basis[2] * 0.25 + ',' + basis[3] * 0.88

                    ],
                    "ih": [
                        "centro_mv.controls(this,'history')",
                        "centro_mv.controls(this,'home')"
                    ]
                };
                break;
            case "museum":
                this[c] = {
                    "shape": "rect",
                    "coords": [
                        basis[2] * 0.06 + ',' + basis[3] * 0.12 + ',' + basis[2] * 0.25 + ',' + basis[3] * 0.17,
                        basis[2] * 0.06 + ',' + basis[3] * 0.20 + ',' + (basis[2] - basis[2] * 0.06) + ',' + basis[3] * 0.25,
                        basis[2] * 0.06 + ',' + basis[3] * 0.26 + ',' + (basis[2] - basis[2] * 0.06) + ',' + basis[3] * 0.33
                    ],
                    "ih": [
                        "centro_mv.controls(this,'guided')",
                        "do_me(app_display_data[app_display_data.act_app].img_ix[0], 'monteverita_1')",
                        "do_me(app_display_data[app_display_data.act_app].img_ix[1], 'monteverita_2')"
                    ]
                };


                var bg = document.createElement('img');

                bg.src = 'mediaguides/monteverita/museum.png';

                bg.onload = function() {

                    centro_mv.element.src = draw_centro_mv_img(centro_mv.entrys_txt[centro_mv.status], this);

                };
                break;
        }

    },

    "status": "home"
};

var app_display_data = {
    "act_app": "",
    "maxfrisch": {
        "img_ix": [1, 4, 8, 12, 14, 18, 21, 27, 31, 35, 39, 41, 45],
        "plc_tx": ['Rosenhof, Brunnen', 'Bodega Española', 'Hotel Storchen', 'Kirche St. Peter', 'Elfuhrgeläute auf der Münsterbrücke', 'Café Terrasse', 'Café Odeon', 'Kronenhalle', 'Stadelhofer Passage, letzte Wohnung von Max Frisch', 'Schauspielhaus Zürich', 'Kantonales Realgymnasium', 'Universität Zürich', 'ETH Zürich'],
        "apendix": function() {
            return '<p>Wählen sie einen Spaziergang.</p><p><img class="artwork" src="mediaguides/' + app_display_data.act_app + '/app_artwork.jpg" alt="App Artwork" height="175" width="175"></p><p>Die  App bietet Ihnen:</p><ul><li>drei Stadtspaziergänge durch verschiedene Quartiere der Stadt Zürich</li><li>21 Audiostationen mit  Informationen über Leben und Werk von Max Frisch</li><li>rund 40 Minuten Audioführung</li><li>rund 68 Abbildungen</li><li>GPS-Lokalisierung Ihres Standortes</li><li>kostenlosen Download</li></ul><p>Erhältlich im App Store für iPhones und Google Play Store:</p><p><a href="https://itunes.apple.com/de/app/id573495442?mt=8" target="_blank"><img src="mediaguides/apples-app-store.png" alt="Zum download im App Store" height="70" width="70"></a> <a href="https://play.google.com/store/apps/details?id=com.tatentraeger.maxfrischapp" target="_blank"><img src="mediaguides/google_play.png" alt="Zum download im Google Play Store" height="70" width="217"></a></p>';
        }
    },
    "monteverita": {
        "img_ix": [1, 3, 4, 15, 9, 18, 13],
        "apendix": function() {
            return '<p>Wählen sie ein Thema aus der App.</p><p><img class="artwork" src="mediaguides/' + app_display_data.act_app + '/app_artwork.jpg" alt="App Artwork" height="175" width="175"></p><p>Die  App bietet Ihnen:</p><ul><li>Audioguide mit historischen Fotografien</li><li>Videoguide von Harald Szeemann und zu Labans Ikosaeder</li><li>Geschichte, Epochen und Persönlichkeiten des Monte Verità</li><li>Der Monte Verità heute</li><li>Gästebuch</li><li>Persönlichkeitstest: Was für ein Monteveritaner sind Sie?</li><li>Sprachen: Deutsch, Italienisch, Französisch, Englisch</li></ul><p>Erhältlich im App Store für iPhones und Google Play Store:</p><p><a href="https://itunes.apple.com/ch/app/mediaguide-monte-verita/id975156405?l=de&mt=8" target="_blank"><img src="mediaguides/apples-app-store.png" alt="Zum download im App Store" height="70" width="70"></a> <a href="https://play.google.com/store/apps/details?id=org.webatelier.monteverita" target="_blank"><img src="mediaguides/google_play.png" alt="Zum download im Google Play Store" height="70" width="217"></a></p>';
        }
    }
};



var do_cords = function(ta) {

    if (document.getElementById('app_centro')) {

        var ac = document.getElementById('app_centro');

        setTimeout(function() {

            if (typeof ta === 'undefined') {
                centro_mv.status = "home";
                centro_mv.cont("home");
            } else {
                centro_mv.cont(ta);
            }

            ac.innerHTML = '';
            for (var a = 0; a < centro_mv[centro_mv.status].ih.length; a++) {
                ac.innerHTML += '<area shape="' + centro_mv[centro_mv.status].shape + '" onclick="' + centro_mv[centro_mv.status].ih[a] + '" onmouseover="this.style.cursor = \'pointer\'" onmouseout="this.style.cursor = \'default\'">';

            }
            for (var a = 0; a < centro_mv[centro_mv.status].ih.length; a++) {
                ac.children[a].coords = centro_mv[centro_mv.status].coords[a];

            }

        }, 500);

    }



};


function draw_centro_mv_img(tx, bg) {

    if (canvas) {
        canvas = null;
    }

    var canvas = document.createElement('canvas');

    canvas.width = 298;
    canvas.height = 600;
    var ctx = canvas.getContext("2d");

    ctx.drawImage(bg, 0, 0);

    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#999';
    //ctx.lineWidth = 0.5;
    ctx.font = "12px Helvetica";

    for (var a = 0; a < tx.length; a++) {
        ctx.fillText(
            tx[a],
            32,
            136 + a * 48
        );
        ctx.moveTo(
            32,
            154 + a * 48
        );
        ctx.lineTo(
            canvas.width - 32,
            154 + a * 48
        );
        ctx.stroke();
    }
    return canvas.toDataURL();

};


function loadXMLDoc(url, cfunc) {

    xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = cfunc;

    xmlhttp.open("GET", url, true);

    xmlhttp.send();

}


var display_prel;

var preload_rest = function(d) {
    for (var i = 0; i < folders[chapter].data.length; i++) {


        //	preload the other images

        if (folders[chapter].data[i].bilder.length > 2) {
            for (var j = 2; j < folders[chapter].data[i].bilder.length; j++) {

                var imageObj = new Image();

                imageObj.src = img_type.path + d + '/' + folders[chapter].data[i].comp_name + '_' + j + img_type.ext;

            }

        }


    }
};

var preload_images = {

    'gia_calls': 0,
    'get_arrays': function(kind, dir, n) {

        var d = (Array.isArray(dir)) ? dir[preload_images.gia_calls][n] : dir[n];

        loadXMLDoc('scripts/inhalte.php?ordner=../images/' + d + '/&zuza' + Math.floor(Math.random() * (1000) + 1), function() {

            if (xmlhttp.readyState == 4) {

                if (xmlhttp.status == 200) {

                    preload_images.txt = xmlhttp.responseText;
                    preload_images.temp = preload_images.txt.split(' ');

                    var f = [];

                    for (a in preload_images.temp) {

                        if (Array.isArray(dir)) {

                            if (preload_images.temp[a].indexOf('.jpg') != -1) {
                                if (preload_images.temp[a].indexOf('_') == -1) {

                                    f.push(preload_images.temp[a]);
                                }

                            }

                            if (preload_images.temp[a].indexOf('.mp4') != -1) {

                                var s = preload_images.temp[a].replace('.mp4', '');

                                var elementPos = folders[preload_images.gia_calls].data.map(function(x) {
                                    return x.comp_name;
                                }).indexOf(s);

                                folders[preload_images.gia_calls].data[elementPos].epilog.Film = s;

                            }

                            if (preload_images.temp[a].indexOf('.mp3') != -1) {

                                var s = preload_images.temp[a].replace('.mp3', '');

                                var elementPos = folders[preload_images.gia_calls].data.map(function(x) {
                                    return x.comp_name;
                                }).indexOf(s);

                                folders[preload_images.gia_calls].data[elementPos].epilog.Hören = s;

                            }

                        } else {

                            if (preload_images.temp[a].indexOf('.jpg') != -1 && preload_images.temp[a].indexOf('_') != -1) {

                                f.push(preload_images.temp[a]);

                            }

                        }

                    }

                    // dir ist array (aufruf folders bei page_load)


                    if (Array.isArray(dir)) {

                        for (var i = 0; i < f.length; i++) {

                            preload_images.add_imp_button(f[i].replace('.jpg', ''));

                            var imageObj = new Image();

                            if (i == f.length - 1) {

                                imageObj.onload = function() {

                                    if (preload_images.gia_calls < dir.length - 1) {

                                        preload_images.gia_calls++;

                                        preload_images.get_arrays(kind, dir, n);

                                    } else {

                                        preload_images.gia_calls = 0;

                                        //console.log(window.location.search.substring(1), folders.length);

                                        var taxi = decodeURI(window.location.search.substring(1));
                                        //                                       (
                                        if (taxi.length > 0 && taxi != ' ') {
                                            //search_nostyle(taxi);
                                            var found_gates = search_nostyle(taxi);
                                            //console.log(found_gates[0], found_gates[1]);
                                            if (found_gates.length == 1) {
                                                hit_menue(0);
                                            } else {
                                                if (found_gates[1] == 0) {
                                                    console.log('alt hit menue');
                                                    hit_menue(0);
                                                    setTimeout(function() {
                                                        jump_to(found_gates[0], found_gates[1]);
                                                    }, 400);
                                                } else {

                                                    jump_to(found_gates[0], found_gates[1]);
                                                }
                                            }
                                        } else {
                                            hit_menue(0);
                                        }

                                        //	SEO stuff

                                        // add alt to images

                                        var m_cont = '';

                                        for (var alx = 0; alx < display_prel.children.length; alx++) {

                                            if (!display_prel.children[alx].alt) {

                                                display_prel.children[alx].alt = display_prel.children[alx].title + ' palma3';

                                                m_cont += display_prel.children[alx].title + ' ';

                                            }

                                        }

                                        // create and add metatag

                                        //console.log(m_cont);

                                        var m = document.createElement('meta');
                                        m.name = 'keywords';
                                        m.content = 'botsi code palma3 bern ' + m_cont;
                                        document.head.appendChild(m);

                                        //                                      )
                                        //hit_menue(0);
                                        //jump_to(2, 2);

                                        //console.log('img preload loop complete');

                                    }

                                };

                            }

                            imageObj.src = img_type.path + dir[preload_images.gia_calls][n] + '/' + ((img_type.ext == '.jpg') ? f[i] : f[i].replace('.jpg', img_type.ext));

                            if (f[i] != 'default.jpg') {

                                display_prel.innerHTML += '<img src="' + imageObj.src + '" title="' + f[i].replace('.jpg', '') + '" />';

                            }

                        }

                        // dir ist object (aufruf folders[chapter] bei toggle_menue)

                    } else {

                        for (var i = 0; i < f.length; i++) {
                            var s = f[i].replace('.jpg', '').split('_');

                            var elementPos = folders[chapter].data.map(function(x) {
                                return x.comp_name;
                            }).indexOf(s[0]);

                            folders[chapter].data[elementPos].bilder.push(s[1]);
                        }

                        for (var i = 0; i < folders[chapter].data.length; i++) {
                            var arr = folders[chapter].data[i].bilder;

                            if (arr.length > 0) {
                                var imageObj = new Image();
                                if (arr.length == 1 && i == folders[chapter].data.length - 1) {
                                    imageObj.onload = function() {
                                        preload_images.folder_imgs = true;
                                    };
                                }

                                imageObj.src = img_type.path + dir[n] + '/' + folders[chapter].data[i].comp_name + '_1' + img_type.ext;

                                display_prel.innerHTML += '<img src="' + imageObj.src + '" />';

                            }

                            if (arr.length > 1) {
                                var imageObj = new Image();
                                if (i == folders[chapter].data.length - 1) {
                                    imageObj.onload = function() {
                                        preload_images.folder_imgs = true;
                                    };
                                }

                                imageObj.src = img_type.path + dir[n] + '/' + folders[chapter].data[i].comp_name + '_' + arr.length + img_type.ext;

                                display_prel.innerHTML += '<img src="' + imageObj.src + '" />';
                            }

                            if (arr.length == 0 && i == folders[chapter].data.length - 1) {
                                preload_images.folder_imgs = true;
                            }

                        }

                        setTimeout(function() {
                            preload_rest(dir[n]);
                        }, 100);



                    }

                } else {

                    console.log('get_images_array shit happens');

                }
            }

        });

    },
    'add_imp_button': function(f) {

        var elementPos = folders[preload_images.gia_calls].data.map(function(x) {

            return x.comp_name;

        }).indexOf(f);

        if (elementPos != -1) {

            if (typeof folders[preload_images.gia_calls].data[elementPos].epilog !== 'undefined') {

                folders[preload_images.gia_calls].data[elementPos].epilog.Impressionen = (preload_images.txt.indexOf(f + '_') != -1) ? 1 : 0;

            }
        }

    }


};

var getNearestNumber = function(a, n) {
    if ((l = a.length) < 2)
        return l - 1;
    for (var l, p = Math.abs(a[--l] - n); l--;)
        if (p < (p = Math.abs(a[l] - n)))
            break;
    return l + 1;
};

var get_page_scroll_position = function() {

    var h;

    if (document.body.scrollTop) {
        //console.log('dbs: ' + document.body.scrollTop);
        h = document.body.scrollTop;
    } else {
        //console.log('ddEs: ' + document.documentElement.scrollTop);
        h = document.documentElement.scrollTop;
    }
    return h;
};

var toggleFullScreen = function() {

    if (vid.requestFullscreen) {
        vid.requestFullscreen();
    } else if (vid.mozRequestFullScreen) {
        vid.mozRequestFullScreen(); // Firefox
    } else if (vid.webkitRequestFullscreen) {
        vid.webkitRequestFullscreen(); // Chrome and Safari
    }
};

var disable_cine = true;

var resizeId;

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

        if (vid != '') {
            size_video();
        }

        if (document.getElementsByClassName('cheese').length > 0) {
            var uat = document.getElementsByClassName('ueandtx');

            for (var u = 0; u < uat.length; u++) {


                if (uat[u].getElementsByClassName('cheese')[0]) {

                    var x = window.innerWidth - 260;
                    var y = calc_min_slid_height(uat[u].getElementsByClassName('epilog')[0].children.length);

                    var ca = uat[u].getElementsByClassName('cheese')[0];

                    ca.width = x;
                    ca.height = y;

                    draw_cheese_canvas(ca, x, y);

                }

            }

        }

    }, 200);

    do_cords(centro_mv.status);

};

var getchildindex = function(el) {
    var i = 0;
    while ((el = el.previousSibling) != null) {
        i++;
    }
    return i;

};

var calc_min_slid_height = function(ecl) {

    var h = ecl * 26 + 108;

    if (h >= (window.innerHeight - 300) / 2 + 24) {
        return h;
    }

    return (window.innerHeight - 300) / 2 + 24;

};

var page_reload = function() {

    window.location.href = wlh;

};

var select_pdf = {
    "addorremove": function(t) {
        if (t.classList.contains('form_check_white')) {
            t.classList.remove('form_check_white');
            t.classList.add('form_check_blue');
            t.nextSibling.style.visibility = 'visible';
        } else {
            t.classList.remove('form_check_blue');
            t.classList.add('form_check_white');
            t.nextSibling.style.visibility = 'hidden';
        }
        console.log(folders[chapter].data[folders[chapter].last_position].epilog.Dossier.length);
    },
    "collect": function() {
        console.log(folders[chapter].data[folders[chapter].last_position].epilog.Dossier);
        download_pdf();
    }
};

var base64;

var download_pdf = function() {


    var prepare_pdf = function() {

        var c = folders[chapter].data[folders[chapter].last_position]

        var d = document.createElement('div');

        d.innerHTML = c.epilog.Ausstellungskonzept;

        console.log(d.children.length);

        var tx_arr = [{
                text: '\n',
                style: 'header'
            },
            {
                text: c.name,
                style: 'header'
            },
            {
                text: '\n',
                style: 'header'
            }
        ];


        for (var x = 0; x < d.children.length; x++) {
            if (d.children[x].tagName.toLowerCase() == "h2") {
                tx_arr.push({
                    text: '\n',
                    style: 'header'
                });
                tx_arr.push({
                    text: d.children[x].innerHTML,
                    style: 'header'
                });
            } else {

                var a = d.children[x].getElementsByTagName('a');

                while (a.length) {
                    var parent = a[0].parentNode;
                    while (a[0].firstChild) {
                        parent.insertBefore(a[0].firstChild, a[0]);
                    }
                    parent.removeChild(a[0]);
                }

                tx_arr.push({
                    text: '\n'
                });
                tx_arr.push({
                    text: '\n'
                });
                tx_arr.push({
                    text: d.children[x].innerHTML
                });
                tx_arr.push({
                    text: '\n'
                });
            }
        }


        var docDefinition = {
            content: [{
                    image: base64,
                    width: 520
                },
                {
                    text: tx_arr,
                    fontSize: 14
                }
            ],
            styles: {
                header: {
                    color: '#bc123a',
                    fontSize: 22,
                    bold: true
                }
            }
        };

        pdfMake.createPdf(docDefinition).download(c.comp_name + '.pdf');

    };

    if (!pdf_m) {


        var m = document.createElement('script');

        m.onload = function() {

            var f = document.createElement('script');

            f.onload = function() {

                var i = document.createElement('script');

                i.onload = function() {
                    console.log('oki scripts');

                    prepare_pdf();

                };

                i.src = 'images/pdf_head_base64.js';

                document.head.appendChild(i);

            };

            f.src = 'scripts/pdfmake/vfs_fonts.js';

            document.head.appendChild(f);
        };

        m.src = 'scripts/pdfmake/pdfmake.min.js';

        document.head.appendChild(m);




        pdf_m = true;

    } else {

        prepare_pdf();

    }

    /*

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

    */

};
