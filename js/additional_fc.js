/******************************************************************************************
						shop map and app related scripts
******************************************************************************************/

/******************************************************************************************
						shop stuff
******************************************************************************************/



//	spaghetti turn	(for ie)

var mergeObjects = function() {
    var resObj = {};
    for (var i = 0; i < arguments.length; i += 1) {
        var obj = arguments[i],
            keys = Object.keys(obj);
        for (var j = 0; j < keys.length; j += 1) {
            resObj[keys[j]] = obj[keys[j]];
        }
    }
    return resObj;
};

//	end spaghetti turn



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

            /*
            //	modern way	(ie sucks)

            loadXMLDoc(Object.assign({}, shop.fields, {
                "order_text": shop.order_total.replace('Meine Bestellung: ', '').replace('Versandkosten: ', '').replace('Summe: ', ''),
                "order_sum": shop.order_sum
            }));

            */
            //	spaghetti turn	(ie works)

            loadXMLDoc(mergeObjects(shop.fields, {
                "order_text": shop.order_total.replace('Meine Bestellung: ', '').replace('Versandkosten: ', '').replace('Summe: ', ''),
                "order_sum": shop.order_sum
            }));

            //	end spaghetti vs. modern

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


/******************************************************************************************
						end shop stuff
******************************************************************************************/

/******************************************************************************************
						map stuff
******************************************************************************************/


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

/******************************************************************************************
						end map stuff
******************************************************************************************/

/******************************************************************************************
						app stuff
******************************************************************************************/

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


/******************************************************************************************
						end app stuff
******************************************************************************************/