/******************************************************************************************
						predefinitions
******************************************************************************************/

var resizeId;


var display_prel, cc;

/******************************************************************************************
						end predefinitions
******************************************************************************************/

var hist_push = true;

var old_chapter = chapter = 0;

var adjustments_de = {

	dayNames: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
	dayNamesMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
	monthNames: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
	monthNamesMin: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
	years: []

};

var img_type = {
	"path": "images/",
	"ext": ".jpg"
};

var app_display_data = {
	"act_app": "",
	"maxfrisch": {
		"img_ix": [1, 4, 8, 12, 14, 18, 21, 27, 31, 35, 39, 41, 45],
		"plc_tx": ['Rosenhof, Brunnen', 'Bodega Española', 'Hotel Storchen', 'Kirche St. Peter', 'Elfuhrgeläute auf der Münsterbrücke', 'Café Terrasse', 'Café Odeon', 'Kronenhalle', 'Stadelhofer Passage, letzte Wohnung von Max Frisch', 'Schauspielhaus Zürich', 'Kantonales Realgymnasium', 'Universität Zürich', 'ETH Zürich'],
		"apendix": function() {

			var a = ['Erhältlich im App Store:', '<a href="https://itunes.apple.com/de/app/id573495442?mt=8" target="_blank"><img src="mediaguides/apples-app-store.png" alt="Zum download im App Store" height="70" width="70"></a>'];

			var g = ['Erhältlich im Google Play Store:', '<a href="https://play.google.com/store/apps/details?id=com.tatentraeger.maxfrischapp" target="_blank"><img src="mediaguides/google_play.png" alt="Zum download im Google Play Store" height="70" width="217"></a>'];

			var leed = '';

			if (isTouchSupported()) {

				var ag = (window.navigator.userAgent.indexOf("iPad") != -1 || window.navigator.userAgent.indexOf("iPhone") != -1) ? a : g;

			} else {

				var ag = ['Erhältlich im App Store für iPhones und Google Play Store:', a[1] + ' ' + g[1]];

				leed = '<p>Wählen sie einen Spaziergang.</p>';

			}

			return leed + '<p><img class="artwork" src="mediaguides/' + app_display_data.act_app + '/app_artwork.jpg" alt="App Artwork" height="175" width="175"></p><p>Die  App bietet Ihnen:</p><ul><li>drei Stadtspaziergänge durch verschiedene Quartiere der Stadt Zürich</li><li>21 Audiostationen mit  Informationen über Leben und Werk von Max Frisch</li><li>rund 40 Minuten Audioführung</li><li>rund 68 Abbildungen</li><li>GPS-Lokalisierung Ihres Standortes</li><li>kostenlosen Download</li></ul><p>' + ag[0] + '</p><p>' + ag[1] + '</p>';
		}
	},
	"monteverita": {
		"img_ix": [1, 3, 4, 15, 9, 18, 13],
		"apendix": function() {

			var a = ['Erhältlich im App Store:', '<a href="https://itunes.apple.com/ch/app/mediaguide-monte-verita/id975156405?l=de&mt=8" target="_blank"><img src="mediaguides/apples-app-store.png" alt="Zum download im App Store" height="70" width="70"></a>'];

			var g = ['Erhältlich im Google Play Store:', '<a href="https://play.google.com/store/apps/details?id=org.webatelier.monteverita" target="_blank"><img src="mediaguides/google_play.png" alt="Zum download im Google Play Store" height="70" width="217"></a>'];

			var leed = '';

			if (isTouchSupported()) {

				var ag = (window.navigator.userAgent.indexOf("iPad") != -1 || window.navigator.userAgent.indexOf("iPhone") != -1) ? a : g;

			} else {

				var ag = ['Erhältlich im App Store für iPhones und Google Play Store:', a[1] + ' ' + g[1]];

				leed = '<p>Wählen sie ein Thema aus der App.</p>';

			}

			return leed + '<p><img class="artwork" src="mediaguides/' + app_display_data.act_app + '/app_artwork.jpg" alt="App Artwork" height="175" width="175"></p><p>Die  App bietet Ihnen:</p><ul><li>Audioguide mit historischen Fotografien</li><li>Videoguide von Harald Szeemann und zu Labans Ikosaeder</li><li>Geschichte, Epochen und Persönlichkeiten des Monte Verità</li><li>Der Monte Verità heute</li><li>Gästebuch</li><li>Persönlichkeitstest: Was für ein Monteveritaner sind Sie?</li><li>Sprachen: Deutsch, Italienisch, Französisch, Englisch</li></ul><p>' + ag[0] + '</p><p>' + ag[1] + '</p>';
		}
	}
};


var attach_script = function(apx) {

	var work = function(apx) {

		var s = document.createElement('script');

		s.onload = function() {


			var l = document.createElement('link');

			l.onload = function() {

				page_load();

			};

			l.href = 'css/main' + apx + '.css?zuza' + Math.floor(Math.random() * (1000) + 1);
			l.rel = 'stylesheet';
			//l.charset = 'utf-8';

			document.head.appendChild(l);


		};

		s.src = 'js/main' + apx + '.js';
		s.charset = 'utf-8';

		document.head.appendChild(s);

	};

	if (apx == '_desk') {

		var s = document.createElement('script');

		s.onload = function() {

			work(apx);

		};

		s.src = 'js/additional_fc.min.js';
		s.charset = 'utf-8';

		document.head.appendChild(s);
	} else {
		work(apx);
	}



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

var device_dimensions = function() {

	/*
		(function(i, s, o, g, r, a, m) {
			i['GoogleAnalyticsObject'] = r;
			i[r] = i[r] || function() {
				(i[r].q = i[r].q || []).push(arguments)
			}, i[r].l = 1 * new Date();
			a = s.createElement(o),
				m = s.getElementsByTagName(o)[0];
			a.async = 1;
			a.src = g;
			m.parentNode.insertBefore(a, m)
		})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
	*/




	check_webp_feature('lossless', function(result) {

		if (result) {

			img_type.path = 'images/webp/';
			img_type.ext = '.webp';

		}

		var x = screen.width;
		var y = screen.height;

		var source_apx = '';

		switch (true) {
			case (x < 401 && isTouchSupported()):
				img_type.path = 'images/mobile/';
				img_type.ext = '.jpg';
				source_apx = '_mobile';
				//alert(' ' + x + ' x ' + y);
				break;
			case ((x > 400 && x < 951) && isTouchSupported()):
				img_type.path = 'images/mobile/';
				img_type.ext = '.jpg';
				source_apx = '_mobile';
				//source_apx = '_pad';
				//alert('pad ' + x + ' x ' + y);
				break;
			default:
				source_apx = '_desk';
				//alert(x + ' x ' + y);
		}

		attach_script(source_apx);

	});

};




function loadXMLDoc(ud, cfunc) {

	xmlhttp = new XMLHttpRequest();

	if (typeof cfunc !== 'undefined') {

		xmlhttp.onreadystatechange = cfunc;

		xmlhttp.open("GET", ud, true);

	} else {

		var urlEncodedData = "";
		var urlEncodedDataPairs = [];
		var name;

		// Turn the data object into an array of URL-encoded key/value pairs.
		for (name in ud) {
			urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(ud[name]));
		}

		// Combine the pairs into a single string and replace all %-encoded spaces to
		// the '+' character; matches the behaviour of browser form submissions.
		urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

		// Define what happens on successful data submission
		xmlhttp.addEventListener('load', function(event) {

			console.log(event.target.responseText);

			shop.display(true);


		});

		// Define what happens in case of error
		xmlhttp.addEventListener('error', function(event) {
			alert('Oups! Something goes wrong.');
		});

		// Set up our request
		xmlhttp.open('POST', 'scripts/sendmail.php');

		// Add the required HTTP header for form data POST requests
		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	}

	// Finally, send our data.
	xmlhttp.send(urlEncodedData);

}


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

										var taxi = decodeURI(window.location.search.substring(1));

										if (taxi.length > 0 && taxi != ' ') {

											var found_gates = search_nostyle(taxi);

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

										var m = document.createElement('meta');
										m.name = 'keywords';
										m.content = 'botsi code palma3 bern ' + m_cont;
										document.head.appendChild(m);

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

var bilder = function() {

	var c = folders[chapter].data;

	var r = [];

	for (var i = 0; i < c.length; i++) {

		r.push(c[i].bilder);

	}

	return r;

};


var getNearestNumber = function(a, n) {
	if ((l = a.length) < 2)
		return l - 1;
	for (var l, p = Math.abs(a[--l] - n); l--;)
		if (p < (p = Math.abs(a[l] - n)))
			break;
	return l + 1;
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

		return [0];

	}

};

var page_reload = function() {

	window.location.href = wlh;

};

var text_load = function() {

	loadXMLDoc('inhalt.js', function() {

		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) {

				folders = JSON.parse(xmlhttp.responseText).folders;

				device_dimensions();

			} else {
				alert('inhalt shit happens');
			}
		}
	});

};


document.addEventListener('DOMContentLoaded', text_load, false);


var pdf_m = false;

var select_pdf = {
	"act_log": function(c) {
		var r = c.comp_name;
		if (c.epilog.Dossier.indexOf('Einleitung') != -1) {
			r += '_e';
		}
		if (c.epilog.Dossier.indexOf('Orte und Daten') != -1) {
			r += '_o';
		}
		if (c.epilog.Dossier.indexOf('Ausstellungskonzept') != -1) {
			r += '_a';
		}
		if (c.epilog.Dossier.indexOf('Impressum') != -1) {
			r += '_i';
		}

		return r;
	},
	"log": [],
	"get_scr": function(ix) {
		if (!pdf_m) {

			var m = document.createElement('script');

			m.onload = function() {

				var f = document.createElement('script');

				f.onload = function() {

					var i = document.createElement('script');

					i.onload = function() {

						console.log(ix);

						if (typeof ix != 'undefined') {

							select_pdf.collect(ix);

						}
					};

					i.src = 'scripts/pdfmake/vfs_fonts.js';
					i.charset = 'utf-8';

					document.head.appendChild(i);


				};

				f.src = 'scripts/pdfmake/pdfmake.min.js';
				f.charset = 'utf-8';

				document.head.appendChild(f);
			};

			m.src = 'images/pdf_head_base64.js';
			m.charset = 'utf-8';

			document.head.appendChild(m);

			pdf_m = true;

		} else {
			if (typeof ix != 'undefined') {

				select_pdf.collect(ix);

			}
		}

	},
	"addorremove": function(t, ih) {
		if (t.classList.contains('form_check_white')) {
			t.classList.remove('form_check_white');
			t.classList.add('form_check_blue');
			t.nextSibling.style.visibility = 'visible';

			if (folders[chapter].data[folders[chapter].last_position].epilog.Dossier.indexOf(ih) == -1) {
				folders[chapter].data[folders[chapter].last_position].epilog.Dossier.push(ih);
			}

		} else {
			t.classList.remove('form_check_blue');
			t.classList.add('form_check_white');
			t.nextSibling.style.visibility = 'hidden';


			if (folders[chapter].data[folders[chapter].last_position].epilog.Dossier.indexOf(ih) != -1) {
				folders[chapter].data[folders[chapter].last_position].epilog.Dossier.splice(folders[chapter].data[folders[chapter].last_position].epilog.Dossier.indexOf(ih), 1);
			}

		}

		t.parentNode.parentNode.lastChild.getElementsByClassName('alert_line')[0].style.visibility = (select_pdf.log.indexOf(select_pdf.act_log(folders[chapter].data[folders[chapter].last_position])) == -1) ? 'hidden' : 'visible';

		t.parentNode.parentNode.lastChild.style.opacity = (folders[chapter].data[folders[chapter].last_position].epilog.Dossier.length == 0) ? 0.2 : 1;
		t.parentNode.parentNode.lastChild.children[0].style.cursor = (folders[chapter].data[folders[chapter].last_position].epilog.Dossier.length == 0) ? 'default' : 'pointer';

	},
	"collect": function(ix) {

		if (typeof ix != 'undefined') {
			if (folders[chapter].data[ix].epilog.Dossier) {
				if (folders[chapter].data[ix].epilog.Dossier.length == 0) {
					//alert();
					//folders[chapter].data[i].epilog.Dossier.push('Ausstellungsort');
					folders[chapter].data[ix].epilog.Dossier.push('Einleitung');
					folders[chapter].data[ix].epilog.Dossier.push('Orte und Daten');
					if (folders[chapter].data[ix].epilog.Impressum != '') {
						folders[chapter].data[ix].epilog.Dossier.push('Impressum');
					}
				}

				download_pdf();


			}

		} else {

			if (folders[chapter].data[folders[chapter].last_position].epilog.Dossier.length > 0) {

				download_pdf();

			} else {
				alert(folders[chapter].data[folders[chapter].last_position].epilog.Dossier.length + 'iphone');
			}
		}
	},
	"cleanup": function(str, tag, apendix) {

		var dump = document.createElement('div');

		dump.innerHTML = str;

		if (Array.isArray(apendix)) {

			return (function() {
				return dump.innerHTML.replace(/<\/strong>/g, '\n').replace(/<strong>/g, '\n\n').replace(/<\/p>/g, '\n').split('<p>');
			}());

		} else {

			var x = dump.getElementsByTagName(tag);

			while (x.length) {
				var parent = x[0].parentNode;
				while (x[0].firstChild) {
					parent.insertBefore(x[0].firstChild, x[0]);
				}
				parent.removeChild(x[0]);
			}

			if (tag == 'a' && dump.innerHTML.indexOf(' &amp; ') != -1) {

				dump.innerHTML = dump.innerHTML.replace(' &amp; ', ' and ');

			}

			return dump.innerHTML;

		}
	}
};

var base64;

var download_pdf = function() {

	var c = folders[chapter].data[folders[chapter].last_position];

	var tx_arr = [{
			image: base64,
			width: 520
		}, {
			text: '\n',
			style: 'header'
		},
		{
			text: c.name + ' - ' + adjustments_de.monthNames[c.time.from[1] - 1] + ' ' + c.time.from[2],
			style: 'header'
		},
		{
			text: '\n',
			style: 'header'
		}

	];

	if (c.epilog.Dossier.indexOf('Einleitung') != -1) {

		tx_arr.push({
			text: '\n',
			style: 'header'
		}, {
			text: '  Einleitung  \n',
			style: 'header_blue'
		}, {
			text: '\n',
			style: 'header'
		}, {
			text: c.prolog.replace(/<br>/g, '\n\n').replace(/<br\/>/g, '\n\n') + '\n',
			style: 'header'
		}, {
			text: '\n',
			style: 'header'
		});

		var ein_txt = c.text;

		if (ein_txt.indexOf('</a>') != -1) {

			var ia_dump = document.createElement('div');

			ia_dump.innerHTML = ein_txt;


			var a = ia_dump.getElementsByTagName('a');

			while (a.length) {
				var parent = a[0].parentNode;
				while (a[0].firstChild) {
					parent.insertBefore(a[0].firstChild, a[0]);
				}
				parent.removeChild(a[0]);
			}

			ein_txt = ia_dump.innerHTML;

		}




		tx_arr.push({
			text: ein_txt.replace(/<br>/g, '\n').replace(/<br\/>/g, '\n') + '\n'
		});


		if (c.epilog.Dossier.indexOf('Orte und Daten') != -1 || c.epilog.Dossier.indexOf('Impressum') != -1 || c.epilog.Dossier.indexOf('Ausstellungskonzept') != -1) {

			tx_arr.push({
				text: '',
				pageBreak: 'after'
			});

		}

	}
	if (c.epilog.Dossier.indexOf('Ausstellungskonzept') != -1) {

		tx_arr.push({
			text: '\n',
			style: 'header'
		}, {
			text: '  Ausstellungskonzept  \n',
			style: 'header_blue'
		}, {
			text: '\n',
			style: 'header'
		});

		var d = document.createElement('div');

		d.innerHTML = c.epilog.Ausstellungskonzept;

		for (var x = 0; x < d.children.length; x++) {
			if (d.children[x].tagName.toLowerCase() == "h2") {
				tx_arr.push({
					text: '\n',
					style: 'header'
				});
				tx_arr.push({
					text: d.children[x].innerHTML.replace(/<br>/g, '\n\n').replace(/<br\/>/g, '\n\n'),
					style: 'header'
				});
			} else {

				tx_arr.push({
					text: '\n\n'
				});

				var dx = d.children[x].innerHTML;

				dx = (function() {
					return select_pdf.cleanup(dx, 'a');
				}());

				dx = (function() {
					return select_pdf.cleanup(dx, 'li');
				}());

				if (dx.indexOf('</p>') != -1) {

					dx = (function() {
						return select_pdf.cleanup(dx, 'p', []);
					}());

					for (var r = 0; r < dx.length; r++) {
						tx_arr.push({
							text: dx[r]
						});
					}

				} else {

					tx_arr.push({
						text: dx.replace(/<br>/g, '\n').replace(/<br\/>/g, '\n')
					});

				}

				tx_arr.push({
					text: '\n'
				});
			}
		}

		if (c.epilog.Dossier.indexOf('Orte und Daten') != -1 || c.epilog.Dossier.indexOf('Impressum') != -1) {

			tx_arr.push({
				text: '',
				pageBreak: 'after'
			});

		}

	}

	if (c.epilog.Dossier.indexOf('Impressum') != -1) {

		tx_arr.push({
			text: '\n',
			style: 'header'
		}, {
			text: '  Impressum  \n',
			style: 'header_blue'
		}, {
			text: '\n',
			style: 'header'
		});

		for (var key in c.epilog.Impressum) {

			var imp_arr = c.epilog.Impressum[key][0].replace(/,/g, '');

			if (c.epilog.Impressum[key].length > 1) {
				for (var i_a = 1; i_a < c.epilog.Impressum[key].length; i_a++) {
					imp_arr += ', ' + c.epilog.Impressum[key][i_a].replace(/,/g, '');
				}
			}

			if (imp_arr.indexOf('</a>') != -1) {

				imp_arr = select_pdf.cleanup(imp_arr, 'a');

			}

			tx_arr.push({
				text: '\n',
				style: 'header'
			}, {
				text: key + '\n',
				style: 'header'
			}, {
				text: '\n',
				style: 'header'
			});

			tx_arr.push({
				text: imp_arr + '\n'
			});
			tx_arr.push({
				text: '\n'
			});

		}

		if (c.epilog.Dossier.indexOf('Orte und Daten') != -1) {

			tx_arr.push({
				text: '',
				pageBreak: 'after'
			});

		}

	}

	if (c.epilog.Dossier.indexOf('Orte und Daten') != -1) {

		tx_arr.push({
			text: '\n',
			style: 'header'
		}, {
			text: '  Orte und Daten  \n',
			style: 'header_blue'
		}, {
			text: '\n',
			style: 'header'
		});

		var d = document.createElement('div');

		d.innerHTML = c.epilog.Ausstellungsort;

		var d_s = d.getElementsByTagName('span');

		var prev_d = 'xyz';

		for (var ds_x = 0; ds_x < d_s.length; ds_x++) {

			if (d_s[ds_x].getElementsByTagName('p')[0].innerHTML != prev_d) {

				tx_arr.push({
					text: '\n',
					style: 'header'
				}, {
					text: d_s[ds_x].getElementsByTagName('p')[0].innerHTML + '\n',
					style: 'header'
				}, {
					text: '\n'
				});
			}

			prev_d = d_s[ds_x].getElementsByTagName('p')[0].innerHTML;

			var d_s_p = d_s[ds_x].getElementsByTagName('p')[1].innerHTML + '\n' + d_s[ds_x].getElementsByTagName('p')[2].innerHTML + '\n' + d_s[ds_x].getElementsByTagName('p')[3].innerHTML;

			tx_arr.push({
				text: d_s_p + '\n\n'
			});

			if (d_s[ds_x].getElementsByTagName('p').length > 5) {
				var d_s_p_l = d_s[ds_x].getElementsByTagName('p')[5].innerHTML;
				tx_arr.push({
					text: d_s_p_l + '\n\n',
					link: 'http://' + d_s_p_l
				});
			}

			tx_arr.push({
				text: '\n'
			});

		}

	}

	var docDefinition = {
		footer: function(currentPage, pageCount) {

			if (currentPage == pageCount) {

				return {
					text: '© 2017 | www.palma3.ch',
					link: 'http://www.palma3.ch/?' + c.comp_name,
					margin: [40, -20, 0, 0]
				};
			}

			return '';

		},
		pageSize: 'A4',
		content: tx_arr,
		styles: {
			header: {
				color: '#bc123a',
				fontSize: 20,
				bold: true
			},
			header_blue: {
				color: '#fff',
				background: '#8daad4',
				margin: [8, 0, 0, 0],
				fontSize: 16
			}
		}
	};

	if (select_pdf.log.indexOf(select_pdf.act_log(c)) == -1) {

		select_pdf.log.push(select_pdf.act_log(c));

		pdfMake.createPdf(docDefinition).download(c.comp_name + '.pdf');

	} else {
		document.getElementsByClassName('alert_line')[folders[chapter].last_position].style.visibility = 'visible';
	}

};
