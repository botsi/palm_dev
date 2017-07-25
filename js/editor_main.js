			var folders, to_edit, to_edit_folder, to_edit_image, swap, save_image_presets, TextEditor, Positioner, Unsaved, all_search, canvArrow;

			var cont_new_image = {};

			var largest = 0;

			var disable_img_over = false;

			var temp_ih = '';


			var adjustments_de = {

				dayNames: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
				dayNamesMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
				monthNames: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
				monthNamesMin: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
				years: []

			};

			var media_options = {
				"PDF": ["Südostschweiz", "Tages Anzeiger", "Der Bund", "Berner Zeitung", "Berner Kulturagenda", "Berner Bär"],
				"Video": ["Palma3", "ArtTV"],
				"Audio": ["Palma3", "Radio SRF Treffpunkt", "Radio RSI Rete Due Laser"]
			};

			var sel = [
				[], adjustments_de.monthNames, []
			];
			for (var i = 1; i < 32; i++) {
				sel[0].push(i);
			}
			for (var i = 2000; i < new Date().getFullYear() + 11; i++) {
				sel[2].push(i);
			}

			var loadXMLDoc = function(url, cfunc, val) {

				xmlhttp = new XMLHttpRequest();

				xmlhttp.onreadystatechange = cfunc;

				if (url.search('new_e') != -1 || url.search('rename_imgs') != -1 || url.search('delete_img') != -1 || url.search('upload_imgs') != -1 || url.search('upload_webp') != -1) {

					xmlhttp.open("POST", url, true);

					if (url.search('upload_imgs') != -1) {
						/* reader */
					} else {

						xmlhttp.setRequestHeader("expires", "0");
						xmlhttp.setRequestHeader("Content-type", "application/json");

					}

					xmlhttp.send(val);

				} else {

					xmlhttp.open("GET", url, true);

					xmlhttp.send();

				}

			};

			var index_in_parent = function(child) {
				var i = 0;
				while ((child = child.previousSibling) != null) {
					i++;
				}
				return i;
			};



			/******           remove image           ******/

			var remove_image = function() {

				var r = confirm('Bild Nummer ' + document.getElementById('image_selector').store_img + ' wirklich dauerhaft aus ' + to_edit.name + ' entfernen?');

				if (r == true) {

					document.getElementById('image_selector').style.backgroundImage = 'none';
					document.getElementById('image_selector').style.display = 'none';

					run_swap_multiples = document.getElementById('image_selector').store_img;

					swap_multiples(run_swap_multiples);

				}


			};


			/******           add image           ******/

			var add_image = function(t) {

				come_selector(t);

			};



			/*******        ******/

			/* Define function for escaping user input to be treated as 
			   a literal string within a regular expression */
			function escapeRegExp(string) {
				return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
			}

			/* Define functin to find and replace specified term with replacement string */
			function replaceAll(str, term, replacement) {
				return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
			}


			/*******        ******/




			/******           update_image_links           ******/

			var update_image_links = {
				"dat": false,
				"foo": function() {

					var json = update_image_links.dat;

					update_image_links.dat = false;

					update_links_after_images = function() {
						return false;
					};

					var numberPattern = /slide_lr\(\d+/g;

					var one = JSON.parse(json).one.replace(to_edit.comp_name + '_', '');

					var two = JSON.parse(json).two.replace(to_edit.comp_name + '_', '');

					if (to_edit.text.match(numberPattern) != null) {

						var count = 0;

						var founds = '';

						for (var i = 0; i < to_edit.text.match(numberPattern).length; i++) {

							var found_s_lr_str = to_edit.text.match(numberPattern)[i];

							var found_s_lr_nr = parseInt(found_s_lr_str.replace('slide_lr(', ''));

							if (found_s_lr_nr == one) {

								founds += (founds.indexOf('from') == -1) ? 'from' : '';

							}

							if (found_s_lr_nr == two) {

								founds += (founds.indexOf('to') == -1) ? 'to' : '';

							}

						}

						console.log('found : ', founds);
						/******   oh, must make rochade, so put away nr two ******/
						if (founds == 'fromto' || founds == 'tofrom') {


							for (var i = 0; i < to_edit.text.match(numberPattern).length; i++) {

								var found_s_lr_str = to_edit.text.match(numberPattern)[i];

								var found_s_lr_nr = parseInt(found_s_lr_str.replace('slide_lr(', ''));


								if (found_s_lr_nr == two) {

									//count++;

									var to_rep = found_s_lr_str + ')';

									var rep_with = 'slide_lr(9999' + one + ')';
									console.log('oki found, now rep from / to : ', to_rep, ' / ', rep_with);

									to_edit.text = (function() {
										return replaceAll(to_edit.text, to_rep, rep_with);
									})();

									//fill_cat('text');

								}

							}

						}
						/******   end put away ******/

						/******   now normal work ******/

						for (var i = 0; i < to_edit.text.match(numberPattern).length; i++) {

							var found_s_lr_str = to_edit.text.match(numberPattern)[i];

							var found_s_lr_nr = parseInt(found_s_lr_str.replace('slide_lr(', ''));

							if (found_s_lr_nr == one) {

								count++;

								var to_rep = found_s_lr_str + ')';

								var rep_with = 'slide_lr(' + two + ')';
								console.log('oki found, now rep from / to : ', to_rep, ' / ', rep_with);

								to_edit.text = (function() {
									return replaceAll(to_edit.text, to_rep, rep_with);
								})();

								//fill_cat('text');

							}

							if (found_s_lr_nr == two) {

								count++;

								var to_rep = found_s_lr_str + ')';

								var rep_with = 'slide_lr(' + one + ')';
								console.log('oki found, now rep from / to : ', to_rep, ' / ', rep_with);

								to_edit.text = (function() {
									return replaceAll(to_edit.text, to_rep, rep_with);
								})();

								//fill_cat('text');

							}

						}
						/******   end normal work ******/



						/******   complete rochade (assign nr two) ******/

						if (founds == 'fromto' || founds == 'tofrom') {


							for (var i = 0; i < to_edit.text.match(numberPattern).length; i++) {

								var found_s_lr_str = to_edit.text.match(numberPattern)[i];

								var found_s_lr_nr = parseInt(found_s_lr_str.replace('slide_lr(', ''));


								if (found_s_lr_nr == '9999' + one) {

									//count++;

									var to_rep = 'slide_lr(9999' + one + ')';

									var rep_with = 'slide_lr(' + one + ')';
									console.log('oki found, now rep from / to : ', to_rep, ' / ', rep_with);

									to_edit.text = (function() {
										return replaceAll(to_edit.text, to_rep, rep_with);
									})();

									//fill_cat('text');

								}

							}

						}

						/******   end rochade ******/



						console.log('i count: ', count);

						if (count != 0) {
							fill_cat('text');

							save_existing(document.getElementById('text_display').nextSibling);
						}

					}

					if (to_edit.epilog.Ausstellungskonzept.match(numberPattern) != null) {

						var count = 0;

						for (var i = 0; i < to_edit.epilog.Ausstellungskonzept.match(numberPattern).length; i++) {

							var found_s_lr_str = to_edit.epilog.Ausstellungskonzept.match(numberPattern)[i];

							var found_s_lr_nr = parseInt(found_s_lr_str.replace('slide_lr(', ''));

							if (found_s_lr_nr == one) {

								count++;

								var to_rep = found_s_lr_str + ')';

								var rep_with = 'slide_lr(' + two + ')';
								console.log('oki found, now rep from / to : ', to_rep, ' / ', rep_with);

								to_edit.epilog.Ausstellungskonzept = (function() {
									return replaceAll(to_edit.epilog.Ausstellungskonzept, to_rep, rep_with);
								})();

								fill_cat('Ausstellungskonzept');

							}

						}

						console.log('i count: ', count);

						if (count != 0) {

							save_existing(document.getElementById('Ausstellungskonzept_display').nextSibling);
						}

					}

				}

			};

			var update_links_after_images = function() {
				return false;
			};


			/******           swap_image_positions           ******/

			var swap_image_positions = function(json) {
				console.log('swap: ', json);
				update_image_links.dat = json;

				update_links_after_images = function(json) {

					update_image_links.foo();

				};

				loadXMLDoc('scripts/rename_imgs.php', function() { // swap image names (numbers) on server

					if (xmlhttp.readyState == 4) {
						if (xmlhttp.status == 200) {

							if (!run_swap_multiples) {

								console.log('oki, done', xmlhttp.responseText); // output php echo for control
								temp_ih = '<img src="images/mobile/' + to_edit_folder + '/' + to_edit.comp_name + '.jpg" />';
								load_additional_images(1);

							} else {

								run_swap_multiples = parseInt(run_swap_multiples + 1);
								swap_multiples(run_swap_multiples);
								//alert('not finished');
							}

						} else {
							alert('rename_imgs shit happens');
						}
					}

				}, json);

			};


			/******           close image editor           ******/

			var close_image_editor = function() {

				document.getElementById('image_editor').innerHTML = '';
				document.getElementById('image_editor').style.display = 'none';

				if (document.getElementById('Images_display').lastChild) {
					document.getElementById('Images_display').lastChild.style.display = 'inline';
				}
				document.getElementById('process_overlay').classList.remove('process_overlay_dark');
				document.body.style.background = '#fff';
				document.getElementById('Images_display').style.background = '#ccc';


				disable_img_over = false;

			};


			/******           preview image           ******/

			var preview_image = function(t, arr) {

				var oFReader = new FileReader();
				oFReader.readAsDataURL(t.files[0]);

				oFReader.onload = function(oFREvent) {

					var file = t.files[0];
					// This code is only for demo ...
					console.group("File " + 0);
					console.log("name : " + file.name);
					console.log("size : " + file.size);
					console.log("type : " + file.type);
					console.log("date : " + file.lastModified);
					console.groupEnd();

					var too_big = (file.size > 409600) ? 'Ihr Bild ist leider grösser als 400 Kilobytes.' : false;

					var wrong_type = (file.type != 'image/jpeg') ? 'Ihre Datei ist leider kein Bild im JPG Format.' : false;

					var errors = [];

					if (too_big) {
						errors.push(too_big);
					}

					if (wrong_type) {
						errors.push(wrong_type);
					}

					console.log(errors);

					t.nextSibling.style.zIndex = 1;

					if (errors.length > 0) {

						t.nextSibling.innerHTML = '';

						for (var i = 0; i < errors.length; i++) {
							t.nextSibling.innerHTML += errors[i] + '<br/>';
						}

						document.getElementById('image_editor').style.backgroundImage = 'url("images/editor_error_image.jpg")';

						t.nextSibling.innerHTML += 'Sie können ein anderes Bild hierher ziehen oder den Bildeditor ... <button type="button" onclick="close_image_editor()" style="background:#f00;">schliessen</button>';

					} else {

						document.getElementById('image_editor').style.backgroundImage = 'url("' + oFREvent.target.result + '")';

						console.log('arr: ', arr);

						if (preview_image.length == 2) {

							save_image_presets = [t.files[0], arr[3].comp_name + '.jpg', arr[2]];

							t.nextSibling.innerHTML = 'Bild "' + file.name + '" ... <button type="button" onclick="upload_file(this,cont_new_image.arr)">ok</button>';

						} else {

							save_image_presets = [t.files[0], to_edit.comp_name + '_' + document.getElementById('image_selector').store_img + '.jpg', to_edit_folder];

							t.nextSibling.innerHTML = 'Bild "' + file.name + '" ... <button type="button" onclick="upload_file(this)">speichern</button>';

						}

					}

				};



			};

			var upload_file = function(t, arr) {

				if (upload_file.length == 2) {

					folders[index_in_parent(arr[0].parentNode)].data.splice(arr[1], 0, arr[3]);

					console.log(' wird erstelt! (Lüge) (PRÜFEN!) (Und: bisher ungesicherte Änderungen gehen verloren!) ', folders[index_in_parent(arr[0].parentNode)].data);

					to_edit = arr[3];
					to_edit_folder = arr[2];

					func_after_Image = function() {

						document.getElementById('process_overlay').classList.add('process_overlay_dark');

						var newtext = JSON.stringify({
							"folders": folders
						}, null, "\t");

						loadXMLDoc('scripts/new_e.php', function() { // save changed json data to server

							if (xmlhttp.readyState == 4) {
								if (xmlhttp.status == 200) {

									var resp = xmlhttp.responseText.split(' ');

									console.log('oki, done ', resp[0]); // output php echo for control

									if (resp[0] == 'ok') {

										/******           end overlay moved after up_git           ******/

										up_git(to_edit.name, logged_user, newtext, resp[1], resp[2], resp[3], resp[4], resp[5], 'editor.php?' + arr[3].comp_name);

									} else {

										/******           reload_page           ******/

										console.log('editor.php/?' + new_p.comp_name);

										window.location.href = 'editor.php?' + new_p.comp_name;

									}

								} else {
									alert('new_e (new entry built) shit happens');
								}
							}
						}, newtext);

						func_after_Image = function() {
							return false;
						};

					};
				}

				t.parentNode.classList.add('img_uploader_active');

				t.parentNode.innerHTML = ' ... bitte warten ...';

				var fd = new FormData();
				fd.append("upload_file", save_image_presets[0], save_image_presets[1]);
				fd.append('extraParam', save_image_presets[2]);

				loadXMLDoc('scripts/upload_imgs.php', function() { // swap image names (numbers) on server

					if (xmlhttp.readyState == 4) {
						if (xmlhttp.status == 200) {

							console.log('oki, done', xmlhttp.responseText, 'now WebP ... '); // output php echo for control

							WebPEncDemo();

						} else {
							alert('upload_file (jpg) shit happens');
						}
					}

				}, fd);

			};


			/******           edit_image           ******/

			var new_image = function(t, p, ix, f, new_p) {

				document.getElementById('process_overlay').classList.add('process_overlay_dark');

				disable_img_over = true;

				document.getElementById('image_editor').style.display = 'block';

				cont_new_image.foo = function(a) {

					var project = a.previousSibling.value;

					if (project == "" || project == " " || project.length < 2 || project.indexOf('eval(') != -1 || project.indexOf('<') != -1 || project.indexOf('>') != -1) {

						console.log('Aha, doch lieber nicht!');
						close_image_editor();

					} else {

						document.getElementById('image_editor').innerHTML = '<p><i class="fa fa-times-circle" aria-hidden="true" onclick="close_image_editor()"></i></p><input type="file" id="myFile" onchange="preview_image(this,cont_new_image.arr)"><p style="z-index:0;">neues Bild hierher ziehen ...</p>';

						document.getElementById('image_editor').style.backgroundImage = 'url("images/editor_new_image.jpg")';

						new_p.name = project;
						new_p.comp_name = new_p.search[0] = project.toLowerCase().replace(/ /g, '').replace(/ü/g, 'u').replace(/ä/g, 'a').replace(/ö/g, 'o');
						if (new_p.name.toLowerCase().replace(/ /g, '') != new_p.comp_name) {
							new_p.search[1] = project.toLowerCase().replace(/ /g, '');
						}

						new_p.epilog.Info = "";

						cont_new_image.arr = [t, ix, f, new_p];

					}

				};

				document.getElementById('image_editor').innerHTML = '<p><i class="fa fa-times-circle" aria-hidden="true" onclick="close_image_editor()"></i></p><input type="text" onkeyup="sh_vis(this.nextSibling,1)" ><button onclick="cont_new_image.foo(this)" style="visibility:hidden;margin-top: 100px;">ok</button><p style="z-index:0;">Bitte einen Namen für ' + p + ' angeben.</p>';

				document.getElementById('image_editor').getElementsByTagName('input')[0].classList.add('new_image_text');

				document.getElementById('image_editor').getElementsByTagName('input')[0].focus();

			};

			/******           edit_image           ******/

			var sh_vis = function(el, sh) {
				el.style.visibility = (sh = 1) ? 'visible' : 'hidden';
			};

			/******           edit_image           ******/

			var edit_image = function(img) {

				document.getElementById('process_overlay').classList.add('process_overlay_dark');


				document.getElementById('image_selector').style.backgroundImage = 'none';
				document.getElementById('image_selector').style.display = 'none';

				if (document.getElementById('Images_display').lastChild) {
					document.getElementById('Images_display').lastChild.style.display = 'none';
				}

				disable_img_over = true;

				document.getElementById('image_editor').innerHTML = '<p><i class="fa fa-times-circle" aria-hidden="true" onclick="close_image_editor()"></i></p><input type="file" id="myFile" onchange="preview_image(this)"><p style="z-index:0;">neues Bild hierher ziehen ...</p>';

				document.getElementById('image_editor').style.backgroundImage = (!img) ? 'url("' + to_edit_image + '")' : 'url("images/editor_new_image.jpg")';

				document.getElementById('image_editor').style.display = 'block';

			};

			/******           come selector           ******/

			var come_selector = function(t) {

				console.log('disable_img_over: ', disable_img_over);

				if (disable_img_over) {
					return false;
				}



				if (t.tagName.toLowerCase() != 'img') {
					var s = t.previousSibling.src.split('_')[0];

					to_edit_image = s + '_' + index_in_parent(t) + '.jpg';

					document.getElementById('image_selector').store_img = index_in_parent(t);
					edit_image('value');
					return;
				} else {
					to_edit_image = t.src;

					document.getElementById('image_selector').store_img = index_in_parent(t);
				}


				document.getElementById('image_selector').style.left = t.offsetLeft + 'px';
				document.getElementById('image_selector').style.top = t.offsetTop + 'px';
				document.getElementById('image_selector').style.display = 'flex';
			};


			/******           validate           ******/


			var validate_link_ih = function(t) {
				t.parentNode.getElementById('confirm_link').classList.add('button_valid');
			};

			var validate_link_target = function() {

				console.log('okoko');

				document.getElementById('confirm_link').classList.add('button_valid');

				if (link_editor.link_kind == 'slide_lr') {

					var canvas_ini = document.getElementById('Images_display').children[TextEditor.children[4].value].getBoundingClientRect();
					canvArrow.arr = [(canvas_ini.left + canvas_ini.right) / 2, canvas_ini.top + 60];

					drawArrow(canvArrow.arr);

				}

			};

			var validate = function(t, b) {

				if (entry_kind == 'Medienberichte') {
					console.log('Medienberichte return');
					return;
				}

				//console.log(t);
				if (t.id.indexOf('_display') != -1) {
					b = t.nextSibling;
				} else {



					if (t.parentNode.id.indexOf('_display') == -1) {
						if (t.parentNode.parentNode.id.indexOf('_display') != -1) {
							b = t.parentNode.parentNode.nextSibling;
						} else {
							if (t.parentNode.parentNode.parentNode.id.indexOf('_display') != -1) {
								b = t.parentNode.parentNode.parentNode.nextSibling;
							} else {
								b = t.parentNode.parentNode.parentNode.parentNode.nextSibling;
							}
						}
					}

				}

				if (t.tagName.toLowerCase() == 'input') {

					var value = t.value;

					t.style.background = '#fff';
					t.removeAttribute('title');
					t.style.textDecoration = 'none';
				} else {

					var value = t.innerHTML;

				}

				if (isSafari && t.tagName.toLowerCase() == 'select') {
					saf_align(t);
				}




				if ((value == '' || value == ' ' || value.indexOf('eval(') != -1) && (t.getAttribute("datakind") != 0 && t.getAttribute("datakind") < 4)) {
					t.style.background = 'rgb(250, 161, 179)';
					t.style.textDecoration = 'line-through';

					b.classList.remove('button_valid');
					b.nextSibling.classList.remove('button_valid');

					t.title = 'Error: empty, space or eval';

					t.value = '';

					//console.log('nicht akzeptiert', value.indexOf('"'));
					//console.log(value.charAt(value.indexOf('"') - 6), value.charAt(value.indexOf('"') - 5), value.charAt(value.indexOf('"') - 4), value.charAt(value.indexOf('"') - 3), value.charAt(value.indexOf('"') - 2), value.charAt(value.indexOf('"') - 1), value.charAt(value.indexOf('"')));
					return;
				}

				var entry_kind = t.parentNode.id.replace('_display', '');



				if (entry_kind == 'text') {
					//t.parentNode.removeChild(t.parentNode.children[1]);

					/*                                                              **************************************      ho maybe an Error     ************************************** */
					add_text_editor_funcs(t.parentNode);
					/*                                                              **************************************      ho maybe an Error     ************************************** */
				}

				if (entry_kind == 'search') {
					//console.log('index is: ' + all_search.indexOf(value + ',' + to_edit.name));
					//console.log(to_edit.name);
					//console.log(all_search);
					if (all_search.term.indexOf(value) != -1) {
						t.style.background = 'rgb(250, 161, 179)';
						t.style.textDecoration = 'line-through';

						b.classList.remove('button_valid');
						b.nextSibling.classList.remove('button_valid');

						t.title = 'Das Stichwort ' + value + ' existiert leider bereits\nin ' + all_search.position[all_search.term.indexOf(value)] + '!';

						t.addEventListener("blur", function() {
							remove_search_item(this.nextSibling);
						}, false);

						return;
					}
				}

				if (entry_kind == 'time') {

					var els = t.parentNode.getElementsByTagName('select');

					for (var i = 0; i < els.length; i++) {
						els[i].style.background = '#fff';
						els[i].removeAttribute('title');
						els[i].style.textDecoration = 'none';
					}

					if (t != els[0] && t != els[3]) {

						check_calendar(t);

					}

					//t.blur();

					if (els.length == 6) {

						var date_start = new Date(parseInt(sel[1].indexOf(els[1].value) + 1) + "/" + els[0].value + "/" + els[2].value);

						var date_end = new Date(parseInt(sel[1].indexOf(els[4].value) + 1) + "/" + els[3].value + "/" + els[5].value);

						if (date_start >= date_end) {
							t.style.background = 'rgb(250, 161, 179)';
							t.style.textDecoration = 'line-through';

							if (t == els[0]) {
								els[1].style.background = els[2].style.background = 'rgb(250, 161, 179)';
								els[1].style.textDecoration = els[2].style.textDecoration = 'line-through';
							}

							if (t == els[1]) {
								els[2].style.background = 'rgb(250, 161, 179)';
								els[2].style.textDecoration = 'line-through';
							}

							if (t == els[3]) {
								els[4].style.background = els[5].style.background = 'rgb(250, 161, 179)';
								els[4].style.textDecoration = els[5].style.textDecoration = 'line-through';
							}

							if (t == els[4]) {
								els[5].style.background = 'rgb(250, 161, 179)';
								els[5].style.textDecoration = 'line-through';
							}

							b.classList.remove('button_valid');
							b.nextSibling.classList.remove('button_valid');


							for (var i = 0; i < els.length; i++) {
								els[i].title = 'Datum "von" muss früher als Datum "nach" sein!';
							}

							return;
						}
					} else {}
				}

				if (entry_kind == 'Ausstellungsort') {
					if (t.value.length > 3 && t.getAttribute("datakind") == 3) {
						if (t.value.length == 4 && t.value.match(/^-?\d+$/)) {
							get_geonames_array('number', t);
							console.log("It's a whole number!");
						} else {
							if (t.value.match(/\d+/g) == null) {
								//console.log("no number! ", t.value.match(/\d+/g));    (els[i].getAttribute("datakind") == 3)
								get_geonames_array('string', t);
							}
						}
					}
				}

				if (entry_kind == 'Impressum') {
					if (t.value.length > 3) {

						if (t.className == 'keyfield') {
							var k_els = document.getElementById('Impressum_display').getElementsByClassName('keyfield');
							for (var i = 0; i < k_els.length; i++) {
								if (k_els[i] != t && k_els[i].value.toLowerCase() == value.toLowerCase()) {
									t.style.background = 'rgb(250, 161, 179)';
									t.style.textDecoration = 'line-through';

									b.classList.remove('button_valid');
									b.nextSibling.classList.remove('button_valid');

									t.title = 'Der Eintrag ' + value + ' existiert bereits!';

									t.addEventListener("blur", function() {
										remove_impressum_key(this.nextSibling);
									}, false);

									return;
								}
							}
							//console.log("It's a whole number!");
						}
					}
				}

				show_buttons(b);

			};



			/******           show validation confirm buttons           ******/

			var show_buttons = function(b) {

				b.classList.add('button_valid');
				b.nextSibling.classList.add('button_valid');



				if (Unsaved.innerText.indexOf(b.parentNode.firstChild.innerHTML) == -1) {



					var els_in_table = document.getElementsByClassName('lk');
					var act_el_in_table;
					for (var i = 0; i < els_in_table.length; i++) {
						if (els_in_table[i].innerText == to_edit.name) {
							act_el_in_table = els_in_table[i];
							break;
						}

					}

					var act_el_in_table_BCR = act_el_in_table.getBoundingClientRect();
					//console.log(act_el_in_table_BCR);

					Unsaved.style.right = window.innerWidth - act_el_in_table_BCR.right + 31 + 'px';



					Unsaved.style.display = 'block';


					if (Unsaved.firstChild.innerHTML == '') {
						Unsaved.innerHTML += '<p style="width:' + parseInt(act_el_in_table_BCR.right - act_el_in_table_BCR.left) + 'px;">Ungesicherte Eingaben in ... </p>';
						Unsaved.firstChild.innerHTML = 1;
					} else {
						Unsaved.firstChild.innerHTML = parseInt(Unsaved.firstChild.innerHTML) + 1;
					}

					var newItem = document.createElement("p");

					newItem.innerHTML = b.parentNode.firstChild.innerHTML;

					newItem.style.cursor = 'pointer';

					newItem.addEventListener('click', function() {
						Positioner.style.top = b.offsetTop - window.innerHeight / 2 + 'px';
						Positioner.scrollIntoView({
							block: "start",
							behavior: "smooth"
						});

					}, false);

					Unsaved.appendChild(newItem);

				}


				if (b.getBoundingClientRect().bottom > window.innerHeight) {
					Positioner.style.top = b.offsetTop - window.innerHeight + 180 + 'px';
					Positioner.scrollIntoView({
						block: "start",
						behavior: "smooth"
					});
				}

			};



			/******           hide google short url           ******/

			var hide_gog_short = function(t) {
				return false;
				//if(gog_info){
				//document.getElementsByTagName("body")[0].removeChild(gog_info);
				//}
			};



			/******           check google short url           ******/

			var no_gog_short = function(t) {
				t.parentNode.parentNode.removeChild(t.parentNode);
				document.getElementById('process_overlay').classList.remove('process_overlay_dark');
				document.body.style.background = '#fff';
				document.getElementById('Images_display').style.background = '#ccc';
			};

			var gog_paste = function() {
				console.log('foc', forExecElement.textContent);
				//CopyToClipboard();
			};

			var gog_clc = function() {
				console.log('out click');
			};

			var gog_blur = function() {
				console.log('blu');
			};

			var check_gog_short = function(t) {

				if (t.value == '' && t.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.value != '' && t.previousSibling.previousSibling.previousSibling.previousSibling.value != '' && t.previousSibling.previousSibling.previousSibling.value != '') {

					document.getElementById('process_overlay').classList.add('process_overlay_dark');
					/*
										window.addEventListener("focus", function() {
											gog_paste();
										}, false);
					*/
					/*
										window.addEventListener("blur", function() {
											gog_blur();
										}, false);
					*/
					if (typeof gog_info === 'undefined') {
						gog_info = document.createElement('div');
						gog_info.style = 'position:fixed;cursor:pointer;left:' + parseInt((window.innerWidth - 968) / 2) + 'px;top:' + parseInt((window.innerHeight - 360) / 2) + 'px;width:968px;height:360px;border:24px rgba(141, 170, 212, 0.9) solid;';
						gog_info.style.background = 'url(images/gog_bg.jpg) top left no-repeat';
						gog_info.innerHTML = '<p style="background:rgba(255,255,255,0.8);margin-top:0;">So finden Sie bei Google Maps die Kurz-URL.</p><button type="button" id="go_gog_btn" class="gog_btn button_valid" onclick="" class="button_valid"><i class="fa fa-floppy-o" aria-hidden="true"></i> Ok, mal probieren ... </button><button type="button" class="no_gog_btn button_valid" onmousedown="no_gog_short(this)" class="button_valid"><i class="fa fa-undo" aria-hidden="true"></i> Nein danke!</button><input id="testpaste" />';
						/*gog_info.onmouseout = function(e) {
							e.target.parentNode.removeChild(e.target);
						};*/
						document.getElementsByTagName("body")[0].appendChild(gog_info);
					} else {
						document.getElementsByTagName("body")[0].appendChild(gog_info);
					}

					document.getElementById('testpaste').addEventListener("paste", function(e) {
						alert(e.clipboardData.getData("text/plain"));
					}, false);

					gog_info.onclick = function() {

						//CopyToClipboard();
						//var gog_win = window.open('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCi0JgwWx4peuLZN6b0Ng2xmW825wMj6tc&latlng=46.822617,7.415771', '_blank');
						//var gog_win = window.open('https://maps.googleapis.com/maps/api/geocode/json?address=Dammweg+41,+3013+Bern,+Schweiz&key=AIzaSyCi0JgwWx4peuLZN6b0Ng2xmW825wMj6tc', '_blank');
						//var gog_win = window.open('https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyCi0JgwWx4peuLZN6b0Ng2xmW825wMj6tc&placeid=ChIJUZbNvuw5jkcReK5LdKyO6Do', '_blank');

						var gog_win = window.open('https://www.google.ch/maps/?hl=de&q=' + t.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.value + ', ' + t.previousSibling.previousSibling.previousSibling.previousSibling.value + ', ' + t.previousSibling.previousSibling.previousSibling.value, '_blank');
						/*
											window.addEventListener("focus", function() {
												gog_paste();
											}, false);

//e.clipboardData
						*/



						gog_win.addEventListener("click", function() {
							opener.gog_clc();
						}, false);

						gog_win.addEventListener("blur", function() {
							opener.gog_blur();
						}, false);

					};

				}

			};


			/******           check calendar           ******/


			var ck_calendar = function(el, c, els) {

				if (new Date(parseInt(sel[1].indexOf(els[el + 1].value) + 1) + "/" + c + "/" + els[el + 2].value).getMonth() !== new Date(parseInt(sel[1].indexOf(els[el + 1].value) + 1) + "/1/" + els[el + 2].value).getMonth()) {

					if (els[el].lastChild.selected == true) {
						els[el].lastChild.selected = false;
						els[el].value = parseInt(els[el].lastChild.previousSibling.value);
					}

					els[el].removeChild(els[el].lastChild);

				}

			};

			var check_calendar = function(t) {

				var els = t.parentNode.getElementsByTagName('select');

				var e_ix = (t == els[1] || t == els[2]) ? 0 : 3;

				for (var i = 31; i > 28; i--) {

					if (els[e_ix].children.length != 31) {
						var child = document.createElement('option');
						child.value = parseInt(els[e_ix].children.length + 1);
						els[e_ix].add(child);
					}

				}

				for (var i = 31; i > 28; i--) {

					ck_calendar(e_ix, i, els);

				}

				for (var i = 0; i < els[e_ix].length; i++) {

					var day = adjustments_de.dayNames[new Date(parseInt(sel[1].indexOf(els[e_ix + 1].value) + 1) + "/" + els[e_ix][i].value + "/" + els[e_ix + 2].value).getDay()];

					els[e_ix][i].text = day + ' ' + els[e_ix][i].value + '.';

				}

			};

			/******           remove Ausstellungsort           ******/

			var remove_Ausstellungsort = function(t) {

				show_buttons(t.parentNode.nextSibling);


				var this_key = t.previousSibling;

				var els = document.getElementById('Ausstellungsort_display');

				console.log(els.getElementsByTagName('input').length);

				var els_count = els.children.length;

				var first_remove = index_in_parent(this_key) - 6;

				for (var i = first_remove; i < els_count; i++) {
					if (els.children[first_remove] && els.children[first_remove].className != 'fa fa-minus-circle') {
						els.removeChild(els.children[first_remove]);
					} else {
						break;
					}
				}

				els.removeChild(t.nextSibling);

				els.removeChild(t);

				if (els.getElementsByClassName('fa-minus-circle').length == 1) {

					els.removeChild(els.getElementsByClassName('fa-minus-circle')[0]);

				}

			};


			/******           add Ausstellungsort           ******/

			var add_Ausstellungsort = function(t) {

				var newItem;

				if (document.getElementById('Ausstellungsort_display').getElementsByClassName('fa-minus-circle').length < 1) {

					newItem = document.createElement("i");

					newItem.className = "fa fa-minus-circle";

					newItem.setAttribute("aria-hidden", "true");

					newItem.setAttribute("onclick", "remove_Ausstellungsort(this)");

					document.getElementById('Ausstellungsort_display').insertBefore(newItem, t.previousSibling);

				}

				for (var i = 0; i < 7; i++) {

					newItem = document.createElement("input");

					newItem.type = "text";

					newItem.setAttribute("onkeyup", "validate(this,this.parentNode.nextSibling)");

					newItem.setAttribute("datakind", i);

					newItem.value = "";

					document.getElementById('Ausstellungsort_display').insertBefore(newItem, t);

				}

				newItem = document.createElement("i");

				newItem.className = "fa fa-minus-circle";

				newItem.setAttribute("aria-hidden", "true");

				newItem.setAttribute("onclick", "remove_Ausstellungsort(this)");

				document.getElementById('Ausstellungsort_display').insertBefore(newItem, t);

				newItem = document.createElement("br");

				document.getElementById('Ausstellungsort_display').insertBefore(newItem, t);

			};


			/******           remove impressum key           ******/

			var remove_impressum_key = function(t) {
				//console.log('t: ', t);

				show_buttons(t.parentNode.nextSibling);

				var this_key = t.nextSibling;

				var els = document.getElementById('Impressum_display');

				var els_count = els.children.length;

				var first_remove = index_in_parent(this_key);

				for (var i = first_remove; i < els_count; i++) {
					if (els.children[first_remove] && els.children[first_remove].className != 'keyfield' && els.children[first_remove].className != 'fa fa-plus-circle add-raw') {
						els.removeChild(els.children[first_remove]);
					} else {
						break;
					}
				}

				els.removeChild(t.previousSibling);
				els.removeChild(t);

			};


			/******           add impressum key           ******/

			var add_impressum_key = function(t) {

				var newItem = document.createElement("input");

				newItem.type = "text";

				newItem.className = "keyfield";

				newItem.setAttribute("onkeyup", "validate(this,this.parentNode.nextSibling)");

				newItem.value = "";

				document.getElementById('Impressum_display').insertBefore(newItem, t);

				newItem = document.createElement("i");

				newItem.className = "fa fa-minus-circle";

				newItem.setAttribute("aria-hidden", "true");

				newItem.setAttribute("onclick", "remove_impressum_key(this)");

				document.getElementById('Impressum_display').insertBefore(newItem, t);

				newItem = document.createElement("input");

				newItem.type = "text";

				newItem.setAttribute("onkeyup", "validate(this,this.parentNode.nextSibling)");

				newItem.value = "";

				document.getElementById('Impressum_display').insertBefore(newItem, t);

				newItem = document.createElement("i");

				newItem.className = "fa fa-link";

				newItem.setAttribute("aria-hidden", "true");

				newItem.setAttribute("onclick", "sh_link_editor(this.previousSibling)");

				document.getElementById('Impressum_display').insertBefore(newItem, t);

				newItem = document.createElement("i");

				newItem.className = "fa fa-minus-circle";

				newItem.setAttribute("aria-hidden", "true");

				newItem.setAttribute("onclick", "remove_impressum_value(this)");

				document.getElementById('Impressum_display').insertBefore(newItem, t);

				newItem = document.createElement("i");

				newItem.className = "fa fa-plus-circle";

				newItem.setAttribute("aria-hidden", "true");

				newItem.setAttribute("onclick", "add_impressum_value(this)");

				document.getElementById('Impressum_display').insertBefore(newItem, t);

				newItem = document.createElement("br");

				document.getElementById('Impressum_display').insertBefore(newItem, t);

			};


			/******           remove impressum value           ******/

			var remove_impressum_value = function(t) {
				console.log(t.nextSibling.tagName);
				if (t.previousSibling.previousSibling.previousSibling.previousSibling.className != 'keyfield' || (t.nextSibling && t.nextSibling.tagName.toLowerCase() != 'i')) {

					show_buttons(t.parentNode.nextSibling);

					document.getElementById('Impressum_display').removeChild(t.previousSibling.previousSibling);
					document.getElementById('Impressum_display').removeChild(t.previousSibling);
					document.getElementById('Impressum_display').removeChild(t);
				}
			};


			/******           add impressum value           ******/

			var add_impressum_value = function(t) {

				console.log(t.nextSibling.tagName);

				var newItem = document.createElement("input");

				newItem.type = "text";

				newItem.setAttribute("onkeyup", "validate(this,this.parentNode.nextSibling)");

				newItem.value = "";

				document.getElementById('Impressum_display').insertBefore(newItem, t);

				newItem.placeholder = "neue Person / Firma für " + (function() {

					for (var i = index_in_parent(t); i > -1; i--) {
						if (t.parentNode.children[i].className == 'keyfield') {
							return t.parentNode.children[i].value;
							break;
						}
					}

				})() + " ...";

				newItem.focus();

				newItem = document.createElement("i");

				newItem.className = "fa fa-link";

				newItem.setAttribute("aria-hidden", "true");

				newItem.setAttribute("onclick", "sh_link_editor(this.previousSibling)");

				document.getElementById('Impressum_display').insertBefore(newItem, t);

				newItem = document.createElement("i");

				newItem.className = "fa fa-minus-circle";

				newItem.setAttribute("aria-hidden", "true");

				newItem.setAttribute("onclick", "remove_impressum_value(this)");

				document.getElementById('Impressum_display').insertBefore(newItem, t);

			};


			/******           remove search item           ******/

			var remove_search_item = function(t) {

				var parent_first_input = document.getElementById('search_display').getElementsByTagName('input')[0]

				document.getElementById('search_display').removeChild(t.previousSibling);
				document.getElementById('search_display').removeChild(t);
				console.log(parent_first_input, document.getElementById('search_display').nextSibling);
				validate(parent_first_input, document.getElementById('search_display').nextSibling);

			};


			/******           add search item           ******/

			var add_search_item = function(t) {

				var newItem = document.createElement("input");

				newItem.type = "text";

				newItem.setAttribute("onkeyup", "validate(this,this.parentNode.nextSibling)");

				newItem.value = "";

				document.getElementById('search_display').insertBefore(newItem, t);

				newItem.placeholder = "neues Stichwort ...";

				newItem.focus();

				newItem = document.createElement("i");

				newItem.className = "fa fa-minus-circle";

				newItem.setAttribute("aria-hidden", "true");

				newItem.setAttribute("onclick", "remove_search_item(this)");

				document.getElementById('search_display').insertBefore(newItem, t);

			};




			/******           remove entry           ******/

			var remove_entry = function(t) {
				if (confirm(to_edit.name + ' permanent Löschen?\n\nDies ist nicht rückgängig machbar!') == true) {
					console.log('alles gelöscht! (Lüge)');
				}
			};


			/******           new entry           ******/

			var new_entry = function(t) {

				console.log(to_edit_folder);

				var p = '';

				var ix = 0;

				var f = t.parentNode.innerText.toLowerCase().replace(/ /g, '').replace(/ü/g, 'u').replace(/ä/g, 'a').replace(/ö/g, 'o');

				switch (f) {
					case 'uberuns':
						p = 'die neue Person in ' + t.parentNode.innerText;
						var new_p = {
							"name": "",
							"comp_name": "",
							"search": [],
							"prolog": "",
							"text": "",
							"epilog": {
								"Info": ""
							}
						};
						ix = folders[index_in_parent(t.parentNode)].data.length - 1;
						break;
					case 'beratung':
					case 'audioundvideo':
						p = 'das neue Projekt in ' + t.parentNode.innerText;
						break;
					case 'publikationen':
						p = 'die neue Publikation';
						break;
					default:
						var d = new Date(),
							ti = {
								"from": [d.getDate(), d.getMonth() + 1, d.getFullYear()]
							};
						if (f == 'sonderausstellungen') {
							ti.till = [((d.getDate() < 28) ? d.getDate() : 28), ((d.getMonth() + 7 > 12) ? d.getMonth() - 5 : d.getMonth() + 7), ((d.getMonth() + 7 > 12) ? d.getFullYear() + 1 : d.getFullYear())];
						}
						p = 'die neue Ausstellung in ' + t.parentNode.innerText;
						var new_p = {
							"name": "",
							"comp_name": "",
							"search": [],
							"time": ti,
							"prolog": "",
							"text": "",
							"epilog": {
								"Ausstellungsort": [
									[
										"",
										"",
										"",
										"",
										"",
										"",
										""
									]
								],
								"Impressum": {
									"Kurator": [
										""
									]
								},
								"Dossier": []
							}
						};
				}

				//if (!new_p) {
				console.log('i return', new_p);
				return;
				//}

				new_image(t, p, ix, f, new_p);

			};


			/******           revert           ******/

			var revert = function(t) {

				var entry_kind = t.previousSibling.previousSibling.id.replace('_display', '');

				t.classList.remove('button_valid');
				t.previousSibling.classList.remove('button_valid');
				update_unsaved(t);

				fill_cat(entry_kind);

			};


			/******           replace entry           ******/

			var save_existing = function(t) {

				t.classList.remove('button_valid');
				t.nextSibling.classList.remove('button_valid');
				update_unsaved(t);

				/******           overlay (disable other process)           ******/

				document.getElementById('process_overlay').classList.add('process_overlay_dark');

				var entry_kind = t.previousSibling.id.replace('_display', '');

				switch (entry_kind) {
					case 'name':
						to_edit[entry_kind] = t.previousSibling.value.replace(/(?:\r\n|\r|\n)/g, '<br/>');
						/* update table */
						var lks = document.getElementById('all_cells').getElementsByClassName('lk');
						for (var i = 0; i < lks.length; i++) {
							if (lks[i].innerHTML.indexOf('<i class="fa fa-minus-circle" aria-hidden="true" onclick="remove_entry(this)"></i>') != -1) {
								lks[i].innerHTML = to_edit[entry_kind] + '<i class="fa fa-minus-circle" aria-hidden="true" onclick="remove_entry(this)"></i>';
							}
						}
						/* end update table */
						break;
					case 'prolog':
						to_edit[entry_kind] = t.previousSibling.value.replace(/(?:\r\n|\r|\n)/g, '<br/>');
						break;
					case 'search':
						var a = [];
						var els = t.previousSibling.getElementsByTagName('input');
						for (var i = 0; i < els.length; i++) {
							//console.log('title: ' + els[i].title.length);
							//if (els[i].value != to_edit.comp_name && els[i].value != to_edit.name.toLowerCase().replace(/ /g, '') && els[i].title.length == 0) {
							if (els[i].value != to_edit.comp_name && els[i].value != to_edit.name.toLowerCase().replace(/ /g, '')) {
								a.push(els[i].value);
							}
						}
						to_edit[entry_kind] = a;

						/*    update all_search */

						all_search = {
							"term": [],
							"position": []
						};

						for (var j = 0; j < largest; j++) {
							make_all_search(j);
						}

						/*    end update all_search */

						break;
					case 'text':
						to_edit[entry_kind] = t.previousSibling.innerHTML;
						break;
					case 'time':
						var els = t.previousSibling.getElementsByTagName('select');
						var a = [];
						if (els.length == 3) {
							for (var i = 0; i < 3; i++) {
								if (i == 1) {
									a.push(sel[1].indexOf(els[i].value) + 1);
								} else {
									a.push(parseInt(els[i].value));
								}
							}
							to_edit[entry_kind].from = a;
						}
						if (els.length == 6) {
							var b = [];
							for (var i = 0; i < 3; i++) {
								if (i == 1) {
									a.push(sel[1].indexOf(els[i].value) + 1);
									b.push(sel[1].indexOf(els[i + 3].value) + 1);
								} else {
									a.push(parseInt(els[i].value));
									b.push(parseInt(els[i + 3].value));
								}
							}
							to_edit[entry_kind].from = a;
							to_edit[entry_kind].till = b;
						}
						console.log(a, ' und ', b);
						break;
					case 'Ausstellungsort':
						var a = [];
						var aa = [];
						var els = t.previousSibling.getElementsByTagName('input');
						for (var i = 0; i < els.length; i++) {
							var x = (i + 1) / 7;
							if (x != parseInt(x)) {
								aa.push(els[i].value);
							} else {
								aa.push(els[i].value);
								a.push(aa);
								aa = [];
							}
						}
						if (to_edit.epilog.Ausstellungsort) {
							to_edit.epilog[entry_kind] = a;
						}
						if (to_edit.epilog.Projektort) {
							to_edit.epilog.Projektort = a;
						}
						break;
					case 'Impressum':
						var a = {};
						var els = t.previousSibling.getElementsByTagName('input');
						if (els.length > 0) {
							var temp_key = 0;

							for (var i = 0; i < els.length; i++) {
								if (els[i].className == 'keyfield') {
									temp_key = i;
									a[els[i].value] = [];
								} else {
									//store_link
									/*
									<a href='http://www.josnaepflin.ch/index.html' target='_blank'>Jos Näpflin, Zürich</a>
									*/
									var link_or_text = (els[i].getAttribute("store_link") != null) ? "<a href='" + els[i].getAttribute("store_link") + "' target='_blank'>" + els[i].value + "</a>" : els[i].value;

									a[els[temp_key].value].push(link_or_text);
								}
							}
							to_edit.epilog[entry_kind] = a;
						} else {
							delete to_edit.epilog[entry_kind];
						}
						break;
					case 'Ausstellungskonzept':
						to_edit.epilog[entry_kind] = t.previousSibling.innerHTML;
						break;
					default:
						alert('no save_existing handling defined');
				}

				var newtext = JSON.stringify({
					"folders": folders
				}, null, "\t");

				loadXMLDoc('scripts/new_e.php', function() { // save changed json data to server

					if (xmlhttp.readyState == 4) {
						if (xmlhttp.status == 200) {

							var resp = xmlhttp.responseText.split(' ');

							console.log('oki, done', resp[0]); // output php echo for control

							if (resp[0] == 'ok') {

								/******           end overlay moved after up_git           ******/

								up_git(to_edit.name, logged_user, newtext, resp[1], resp[2], resp[3], resp[4], resp[5]);

							} else {

								/******           end overlay           ******/

								document.getElementById('process_overlay').classList.remove('process_overlay_dark');
								document.body.style.background = '#fff';
								document.getElementById('Images_display').style.background = '#ccc';

							}

						} else {
							alert('new_e shit happens');
						}
					}
				}, newtext);

			};

			/******         end replace entry         ******/


			/******         update unsaved bullet         ******/
			var update_unsaved = function(t) {
				if (Unsaved.children.length > 1) {

					for (var i = 2; i < Unsaved.children.length; i++) {
						if (t.parentNode.firstChild.innerHTML == Unsaved.children[i].innerHTML) {

							Unsaved.removeChild(Unsaved.children[i]);

						}

					}

					Unsaved.firstChild.innerHTML = Unsaved.children.length - 2;

					if (Unsaved.children.length == 2) {

						Unsaved.removeChild(Unsaved.lastChild);
						Unsaved.style.display = 'none';
						Unsaved.firstChild.innerHTML = '';
					}


				}
			}
			/******         end update unsaved bullet         ******/


			/******         special select alignment for safari         ******/

			var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

			var saf_align = function(ta) {

				var t_align = function(t) {

					var newItem = document.createElement("span");

					newItem.style.visibility = 'hidden';

					newItem.style.height = 0;

					newItem.innerHTML = t.options[t.selectedIndex].text;

					document.body.appendChild(newItem);

					var wps = parseInt((parseInt(window.getComputedStyle(t, null).getPropertyValue("width")) - newItem.offsetWidth) / 2) + 'px';

					document.body.removeChild(newItem);

					return wps;

				};

				if (Array.isArray(ta)) {
					for (var i = 0; i < ta.length; i++) {
						ta[i].style.WebkitPaddingStart = t_align(ta[i]);
					}
				} else {
					ta.style.WebkitPaddingStart = t_align(ta);
				}

			};

			/******         end alignment for safari         ******/


			var input_attributes = ' type="text" onkeyup="validate(this,this.parentNode.nextSibling)"';


			var fill_cat = function(c) {

				var el = document.getElementById(c + '_display');

				switch (c) {

					/******           main data           ******/

					case 'name':

						el.value = to_edit.name;

						break;

					case 'prolog':

						el.value = to_edit.prolog.replace(/<br\s*\/?>/mg, "\n");

						break;

					case 'search':

						if (to_edit.name.toLowerCase().replace(/ /g, '') == to_edit.comp_name) {

							temp_ih = '<span>das erste Stichwort wird aus dem Namen / Titel generiert</span><span>fügen Sie bisher auf der Seite nicht vorkommende, passende Stichworte hinzu ...</span><br/>';

							//		add comp_name

							temp_ih += '<input' + input_attributes + ' value="' + to_edit.comp_name + '" disabled />';

						} else {

							temp_ih = '<span>das erstn zwei Stichworte werden aus dem Namen / Titel generiert</span><span>fügen Sie bisher auf der Seite nicht vorkommende, passende Stichworte hinzu ...</span><br/>';

							//		add comp_name and name

							temp_ih += '<input' + input_attributes + ' value="' + to_edit.comp_name + '" disabled /><input' + input_attributes + ' value="' + to_edit.name.toLowerCase().replace(/ /g, '') + '" disabled />';

						}

						for (var j = 0; j < to_edit.search.length; j++) {
							temp_ih += '<input' + input_attributes + ' value="' + to_edit.search[j] + '" /><i class="fa fa-minus-circle" aria-hidden="true" onclick="remove_search_item(this)"></i>';
						}

						temp_ih += '<i class="fa fa-plus-circle" aria-hidden="true" onclick="add_search_item(this)"></i>';

						el.innerHTML = temp_ih;

						break;

					case 'text':

						el.innerHTML = to_edit.text; //.replace(/<br\s*\/?>/mg, "\n");
						add_text_editor_funcs(el);

						break;

					case 'time':
						//			var input_attributes = ' type="text" onchange="validate(this,this.parentNode.nextSibling)"';
						temp_ih = (typeof to_edit.time.till !== 'undefined') ? 'von' : 'ab';

						temp_ih += '<select onchange="validate(this,this.parentNode.nextSibling)">';

						for (var i = 0; i < sel[0].length; i++) {
							temp_ih += (to_edit.time.from[0] != i + 1) ? '<option value="' + sel[0][i] + '">' + sel[0][i] + '</option>' : '<option selected value="' + sel[0][i] + '">' + sel[0][i] + '</option>';
						}

						temp_ih += '</select><select onchange="validate(this,this.parentNode.nextSibling)">';

						for (var i = 0; i < sel[1].length; i++) {
							if (to_edit.time.from[1] != i + 1) {
								temp_ih += '<option value="' + sel[1][i] + '">' + sel[1][i] + '</option>';
							} else {
								temp_ih += '<option selected value="' + sel[1][i] + '">' + sel[1][i] + '</option>';
							}
						}

						temp_ih += '</select><select onchange="validate(this,this.parentNode.nextSibling)">';

						for (var i = 0; i < sel[2].length; i++) {

							if (to_edit.time.from[2] != sel[2][i]) {
								temp_ih += '<option value="' + sel[2][i] + '">' + sel[2][i] + '</option>';
							} else {
								temp_ih += '<option selected value="' + sel[2][i] + '">' + sel[2][i] + '</option>';
							}
						}

						temp_ih += '</select>';


						if (typeof to_edit.time.till !== 'undefined') {
							temp_ih += 'bis';

							temp_ih += '<select onchange="validate(this,this.parentNode.nextSibling)">';

							for (var i = 0; i < sel[0].length; i++) {
								temp_ih += (to_edit.time.till[0] != i + 1) ? '<option value="' + sel[0][i] + '"></option>' : '<option selected value="' + sel[0][i] + '"></option>';
							}

							temp_ih += '</select><select onchange="validate(this,this.parentNode.nextSibling)">';

							for (var i = 0; i < sel[1].length; i++) {
								if (to_edit.time.till[1] != i + 1) {
									temp_ih += '<option value="' + sel[1][i] + '">' + sel[1][i] + '</option>';
								} else {
									temp_ih += '<option selected value="' + sel[1][i] + '">' + sel[1][i] + '</option>';
								}
							}

							temp_ih += '</select><select onchange="validate(this,this.parentNode.nextSibling)">';

							for (var i = 0; i < sel[2].length; i++) {

								if (to_edit.time.till[2] != sel[2][i]) {
									temp_ih += '<option value="' + sel[2][i] + '">' + sel[2][i] + '</option>';
								} else {
									temp_ih += '<option selected value="' + sel[2][i] + '">' + sel[2][i] + '</option>';
								}
							}

							temp_ih += '</select>';

						} else {

							temp_ih += '<i class="fa fa-plus-circle add-raw" aria-hidden="true" onclick="add_time_till(this)"></i>';

						}

						el.innerHTML = temp_ih;

						check_calendar(el.getElementsByTagName('select')[2]);

						if (typeof to_edit.time.till !== 'undefined') {
							check_calendar(el.getElementsByTagName('select')[5]);
						}

						break;

						/******           epilog data           ******/

					case 'Ausstellungsort':
						temp_ih = '<span>von / bis (wenn mehrere Daten)</span><span>Veranstaltungsort</span><span>Strasse und Hausnummer</span><span>Postleitzahl und Ort</span><span>Land (wenn nicht Schweiz)</span><span>Webseite</span><span>GoogleMaps kurz-url</span>';
						if (to_edit.epilog.Ausstellungsort && Array.isArray(to_edit.epilog.Ausstellungsort)) {
							for (var j = 0; j < to_edit.epilog.Ausstellungsort.length; j++) {
								temp_ih += '<input' + input_attributes + ' datakind="0" value="' + to_edit.epilog.Ausstellungsort[j][0] + '" />' + '<input' + input_attributes + ' datakind="1" value="' + to_edit.epilog.Ausstellungsort[j][1] +
									'" />' +
									'<input' + input_attributes + ' datakind="2" value="' + to_edit.epilog.Ausstellungsort[j][2] + '" />' + '<input' + input_attributes + ' datakind="3" value="' + to_edit.epilog.Ausstellungsort[j][3] + '" />' + '<input' + input_attributes + ' datakind="4" value="' + to_edit.epilog.Ausstellungsort[j][4] + '" />' +
									'<input' + input_attributes + ' datakind="5" value="' + to_edit.epilog.Ausstellungsort[j][5] + '" />' + '<input' + input_attributes + ' onmouseover="check_gog_short(this)" onmouseout="hide_gog_short()" datakind="6" value="' + to_edit.epilog.Ausstellungsort[j][6] + '" />';

								temp_ih += (to_edit.epilog.Ausstellungsort.length > 1) ? '<i class="fa fa-minus-circle" aria-hidden="true" onclick="remove_Ausstellungsort(this)"></i><br/>' : '<br/>';

							}


						} else {

							if (to_edit.epilog.Projektort && Array.isArray(to_edit.epilog.Projektort)) {
								for (var j = 0; j < to_edit.epilog.Projektort.length; j++) {
									temp_ih += '<input' + input_attributes + ' datakind="0" value="' + to_edit.epilog.Projektort[j][0] + '" />' + '<input' + input_attributes + ' datakind="1" value="' + to_edit.epilog.Projektort[j][1] + '" />' +
										'<input' + input_attributes + ' datakind="2" value="' + to_edit.epilog.Projektort[j][2] + '" />' + '<input' + input_attributes + ' datakind="3" value="' + to_edit.epilog.Projektort[j][3] + '" />' + '<input' + input_attributes + ' datakind="4" value="' + to_edit.epilog.Projektort[j][4] + '" />' + '<input' +
										input_attributes + ' datakind="5" value="' + to_edit.epilog.Projektort[j][5] + '" />' + '<input' + input_attributes + ' onmouseover="check_gog_short(this)" onmouseout="hide_gog_short()" datakind="6" value="' + to_edit.epilog.Projektort[j][6] + '" />';

									temp_ih += (to_edit.epilog.Projektort.length > 1) ? '<i class="fa fa-minus-circle" aria-hidden="true" onclick="remove_Ausstellungsort(this)"></i><br/>' : '<br/>';

								}
							}
						}

						temp_ih += '<i class="fa fa-plus-circle add-raw" aria-hidden="true" onclick="add_Ausstellungsort(this)"></i>';

						el.innerHTML = temp_ih;

						break;

					case 'Impressum':

						console.log(temp_ih);

						for (var key in to_edit.epilog.Impressum) {
							temp_ih += '<input' + input_attributes + ' value="' + key + '" class="keyfield" /><i class="fa fa-minus-circle" aria-hidden="true" onclick="remove_impressum_key(this)"></i>';
							for (var j = 0; j < to_edit.epilog.Impressum[key].length; j++) {
								temp_ih += '<input' + input_attributes + ' value="' + to_edit.epilog.Impressum[key][j] + '" /><i class="fa fa-minus-circle" aria-hidden="true" onclick="remove_impressum_value(this)"></i>';
							}
							temp_ih += '<i class="fa fa-plus-circle" aria-hidden="true" onclick="add_impressum_value(this)"></i>';
							temp_ih += '<br/>';
						}

						temp_ih += '<i class="fa fa-plus-circle add-raw" aria-hidden="true" onclick="add_impressum_key(this)"></i>';

						el.innerHTML = temp_ih;

						add_inputfield_editor_funcs(el);

						break;

					case 'Ausstellungskonzept':

						el.innerHTML = to_edit.epilog.Ausstellungskonzept;
						add_text_editor_funcs(el);

						break;

					case 'Medienberichte':


						loadXMLDoc('media/' + to_edit_folder + '/' + to_edit.comp_name + '/media.txt', function() { // media txt file

							if (xmlhttp.readyState == 4) {
								if (xmlhttp.status == 200) {

									var media_obj = JSON.parse(xmlhttp.responseText);


									for (var key in media_obj) {

										var fa = '';
										switch (media_obj[key][3]) {

											case 'Video':

												fa = 'fa fa-film';

												break;

											case 'Audio':

												fa = 'fa fa-volume-up';

												break;

											case 'PDF':

												fa = 'fa fa-file-pdf-o';

												break;

											default:

												alert('no fa defined');

										}

										var s = media_obj[key][2].split(" ");

										temp_ih += '<i class="' + fa + ' media_icon_size" aria-hidden="true"></i> ';

										temp_ih += '<input' + input_attributes + ' value="' + media_obj[key][0] + '" />';


										temp_ih += '<select onchange="validate(this,this.parentNode.nextSibling)">';

										temp_ih += '<option selected value="' + media_obj[key][1] + '">' + media_obj[key][1] + '</option>';

										for (var i = 0; i < media_options[media_obj[key][3]].length; i++) {
											temp_ih += '<option value="' + media_options[media_obj[key][3]][i] + '">' + media_options[media_obj[key][3]][i] + '</option>';
										}

										temp_ih += '</select><select onchange="validate(this,this.parentNode.nextSibling)">';

										for (var i = 0; i < sel[1].length; i++) {
											temp_ih += (s[0] != sel[1][i]) ? '<option value="' + sel[1][i] + '">' + sel[1][i] + '</option>' : '<option selected value="' + sel[1][i] + '">' + sel[1][i] + '</option>';
										}

										temp_ih += '</select><select onchange="validate(this,this.parentNode.nextSibling)">';

										for (var i = 0; i < sel[2].length; i++) {
											temp_ih += (s[1] != sel[2][i]) ? '<option value="' + sel[2][i] + '">' + sel[2][i] + '</option>' : '<option selected value="' + sel[2][i] + '">' + sel[2][i] + '</option>';
										}

										temp_ih += '</select>';


										/*
																				for (var j = 0; j < 3; j++) {
																					temp_ih += '<input' + input_attributes + ' value="' + media_obj[key][j] + '" />';
																				}

										*/

										temp_ih += '<i class="fa fa-minus-circle" aria-hidden="true" onclick="remove_media_key(this)"></i><br/>';
									}


									el.innerHTML = temp_ih;

									temp_ih = '';

								} else {
									alert('load media txt shit happens');
								}
							}
						});

						break;


						/*					case '':
												break;
						*/
					default:

						alert('no default fill_cat defined');

				}

				temp_ih = '';

				if (isSafari) {
					saf_align(Array.from(el.getElementsByTagName('select')));
				}

				el.nextSibling.classList.remove('button_valid');
				el.nextSibling.nextSibling.classList.remove('button_valid');

			};




			var edit = function(t) {

				console.log(t);

				if (to_edit == folders[t.getAttribute('f', 0)].data[t.getAttribute('d', 0)]) {
					return;
				}

				var ac = document.getElementById('all_cells').getElementsByTagName('td');

				for (var i = 0; i < ac.length; i++) {

					ac[i].style.background = 'rgba(0,0,0,0)';

					if (ac[i].children.length > 0) {
						ac[i].removeChild(ac[i].children[0]);
					}

				}

				for (var i = Unsaved.children.length - 1; i > 0; i--) {

					Unsaved.removeChild(Unsaved.lastChild);

				}

				//console.log('cat: ', ((5 - parseInt(t.getAttribute('f', 0))) * 1));

				Unsaved.firstChild.innerHTML = '';

				Unsaved.style.display = 'none';

				//var folder_offset = 5 - parseInt(t.getAttribute('f', 0));

				// do this on window resize
				//Unsaved.style.right = 'calc(' + parseInt(folder_offset + 29) + 'px + ' + parseInt(folder_offset * 16 + 2) + 'vw)';

				Unsaved.style.top = t.offsetTop + t.offsetHeight - 6 + 'px';

				t.style.background = 'rgba(141, 170, 212, 0.9)';

				t.innerHTML += '<i class="fa fa-minus-circle" aria-hidden="true" onclick="remove_entry(this)"></i>';

				to_edit = folders[t.getAttribute('f', 0)].data[t.getAttribute('d', 0)];

				to_edit_folder = folders[t.getAttribute('f', 0)].name;

				observe_actual_chapter();


				/******           main data           ******/

				fill_cat('name');

				fill_cat('prolog');

				/******           search           ******/

				if (to_edit.search && Array.isArray(to_edit.search)) {

					fill_cat('search');

				}

				/******           text           ******/

				fill_cat('text');

				/******           time           ******/


				document.getElementById('time_display').innerHTML = '';

				if (to_edit.time) {

					fill_cat('time');

					document.getElementById('time_display').parentNode.style.display = 'block';

				} else {

					document.getElementById('time_display').parentNode.style.display = 'none';

				}

				/******           epilog data           ******/

				/******           Ausstellungsort           ******/


				document.getElementById('Ausstellungsort_display').innerHTML = '';

				if (to_edit.epilog && (to_edit.epilog.Ausstellungsort || to_edit.epilog.Projektort)) {

					fill_cat('Ausstellungsort');

					document.getElementById('Ausstellungsort_display').parentNode.style.display = 'block';

				} else {

					/*

										if (to_edit_folder != 'uberuns' && to_edit_folder != 'audioundvideo' && to_edit_folder != 'publikationen') {

											document.getElementById('Ausstellungsort_display').innerHTML = '<br/><i class="fa fa-plus-circle add-raw" aria-hidden="true" onclick="add_impressum_key(this)"></i>';

											document.getElementById('Ausstellungsort_display').parentNode.style.display = 'block';

										} else {

					*/

					document.getElementById('Ausstellungsort_display').parentNode.style.display = 'none';

					//}

				}

				/******           Impressum           ******/

				document.getElementById('Impressum_display').innerHTML = '';

				if (to_edit.epilog && to_edit.epilog.Impressum) {

					fill_cat('Impressum');

					document.getElementById('Impressum_display').parentNode.style.display = 'block';

				} else {


					if (to_edit_folder != 'uberuns') {

						document.getElementById('Impressum_display').innerHTML = '<br/><i class="fa fa-plus-circle add-raw" aria-hidden="true" onclick="add_impressum_key(this)"></i>';

						document.getElementById('Impressum_display').parentNode.style.display = 'block';

					} else {

						document.getElementById('Impressum_display').parentNode.style.display = 'none';

					}

				}

				/******           Ausstellungskonzept           ******/

				document.getElementById('Ausstellungskonzept_display').innerHTML = '';

				if (to_edit.epilog && to_edit.epilog.Ausstellungskonzept) {

					fill_cat('Ausstellungskonzept');

					document.getElementById('Ausstellungskonzept_display').parentNode.style.display = 'block';

				} else {

					document.getElementById('Ausstellungskonzept_display').parentNode.style.display = 'none';

				}

				/******           Medienberichte           ******/
				/*
								document.getElementById('Medienberichte_display').innerHTML = '';

								if (to_edit.epilog && to_edit.epilog.Medienberichte) {

									fill_cat('Medienberichte');

									document.getElementById('Medienberichte_display').parentNode.style.display = 'block';

								} else {

									document.getElementById('Medienberichte_display').parentNode.style.display = 'none';

								}

				*/

				/******           Images           ******/

				/******           and Medienberichte           ******/

				document.getElementById('image_selector').style.display = 'none';

				temp_ih = '<img src="images/mobile/' + to_edit_folder + '/' + to_edit.comp_name + '.jpg" />';

				func_after_Image = function() {

					document.getElementById('Medienberichte_display').innerHTML = '';

					if (to_edit.epilog && to_edit.epilog.Medienberichte) {

						fill_cat('Medienberichte');

						document.getElementById('Medienberichte_display').parentNode.style.display = 'block';

					} else {

						document.getElementById('Medienberichte_display').parentNode.style.display = 'none';

					}

					func_after_Image = function() {
						return false;
					};

				};


				load_additional_images(1);

				/******           done, now make editor_fields_container visible          ******/

				document.getElementById('editor_fields_container').style.display = 'block';

			};

			/*******    textpart editor functions   *******/

			function getSelectionHtml() {
				var r = 'nix';
				var html = "";
				if (typeof window.getSelection != "undefined") {
					var sel = window.getSelection();
					if (sel.rangeCount) {
						var container = document.createElement("div");
						for (var i = 0, len = sel.rangeCount; i < len; ++i) {
							container.appendChild(sel.getRangeAt(i).cloneContents());
						}
						r = sel.getRangeAt(0).startOffset;
						html = container.innerHTML;
					}
				} else if (typeof document.selection != "undefined") {
					if (document.selection.type == "Text") {
						html = document.selection.createRange().htmlText;
						r = 'createRange: ' + document.selection.createRange();
					}
				}


				return [html, r];
			}

			var text_selected = function(t) {

				var sel = getSelectionHtml();

				if (sel[0].indexOf('<') != -1 || sel[0].indexOf('>') != -1) {
					alert('tag in selection: ' + sel[0]);
					return;
				}

				if (sel[0] == '') {
					if (t.previousSibling.className == 'fa fa-link') {
						t.parentNode.removeChild(t.parentNode.children[1]);
					}
				} else {
					if (t.previousSibling.className != 'fa fa-link') {

						newItem = document.createElement("i");

						newItem.className = "fa fa-link";

						newItem.setAttribute("to_link_text", sel[0]);

						newItem.setAttribute("title", '"' + sel[0] + '" zu einem Link machen');

						newItem.setAttribute("to_link_text_start", sel[1]);

						newItem.setAttribute("aria-hidden", "true");

						newItem.setAttribute("onclick", "sh_link_editor(this)");

						t.parentNode.insertBefore(newItem, t.parentNode.children[1]);

					} else {

						t.previousSibling.setAttribute("title", '"' + sel[0] + '" zu einem Link machen');

						t.previousSibling.setAttribute("to_link_text", sel[0]);

						t.previousSibling.setAttribute("to_link_text_start", sel[1]);
					}
				}

			};

			/*******    textpart editor functions   *******/

			var add_text_editor_funcs = function(el) {

				//if (el.id == 'Ausstellungskonzept_display') {
				//console.log('a s length: ', el.querySelectorAll('a').length);

				var as = el.querySelectorAll('a');
				for (var i = 0; i < as.length; i++) {
					console.log('as[i].onclick: ', as[i].onclick);

					// exclude textparts who have allready onclick

					//if (!as[i].onclick == null) {

					as[i].addEventListener("click", function(event) {
						sh_link_editor(this);
					}, false);
					/*

										} else {
											if (as[i].href) {

												as[i].addEventListener("click", function(event) {
													console.log(this.href);
												}, false);

											}
					*/
					//}
				}
				//}

			};

			/*******    inputfield editor functions   *******/

			var add_inputfield_editor_funcs = function(el) {

				//console.log(el.id);

				//if (el.id == 'Ausstellungskonzept_display') {
				//console.log('a s length: ', el.querySelectorAll('a').length);

				var as = el.querySelectorAll('input');

				var newItem;

				for (var i = 0; i < as.length; i++) {

					if (as[i].className != 'keyfield') {

						if (as[i].value.indexOf('http://') != -1 || as[i].value.indexOf('https://') != -1) {

							newItem = document.createElement("div");

							newItem.innerHTML = as[i].value;

							as[i].setAttribute("store_link", newItem.children[0].href);

							as[i].removeAttribute("value");

							as[i].setAttribute("value", newItem.children[0].innerHTML);

							newItem.removeChild(newItem.children[0]);

							var rest = newItem.innerHTML;

							if (rest != '') {

								var meter = document.createElement("span");

								meter.innerHTML = as[i].value;

								meter.className = 'meter';

								document.getElementById("header").appendChild(meter);

								as[i].style.background = 'linear-gradient(to right, rgba(191, 231, 153, 0.9) ,rgba(191, 231, 153, 0.9) ' + meter.offsetWidth + 'px, #fff ' + meter.offsetWidth + 'px)';

								document.getElementById("header").removeChild(meter);

							} else {

								as[i].style.background = 'rgba(191, 231, 153, 0.9)';

							}

							as[i].value += rest;

							as[i].readOnly = true;

							as[i].onfocus = function() {
								sh_link_editor(this);
							};

						}

						newItem = document.createElement("i");

						newItem.className = "fa fa-link";

						newItem.setAttribute("aria-hidden", "true");

						newItem.setAttribute("onclick", "sh_link_editor(this.previousSibling)");

						document.getElementById('Impressum_display').insertBefore(newItem, as[i].nextSibling);

					}
				}
				//}

			};

			/*******em, as[i].nextSibling);

					}
				}
				//}

			};

			/*******    textparts who have allready onclick   *******/
			var link_editor = {};

			var jump_to = function(f, s) {
				TextEditor.ih_preset = 'jump_to';
				link_editor.link_kind = 'jump_to';
				link_editor.ih_preset = [f, s];
				alert('link_editor.ih_preset is array, from jump_to:', link_editor.ih_preset);
			};

			var slide_lr = function(f) {
				TextEditor.ih_preset = 'slide_lr' + f;
				link_editor.link_kind = 'slide_lr';
				link_editor.ih_preset = f;
			};

			var search_nostyle = function(t) {
				TextEditor.ih_preset_preset = 'search_nostyle' + t.innerHTML;
				link_editor.link_kind = 'search_nostyle';
				link_editor.ih_preset = t.innerHTML;
			};

			var sh_link_editor = function(t) {

				/******   clear TextEditor ih_preset   ******/

				//TextEditor.origin = t;
				link_editor.origin = t;

				/******   end clear   ******/
				var ih = '<label>Link Text:</label><input value="' + link_editor.origin.innerHTML;

				if (link_editor.origin.tagName.toLowerCase() == 'a' && link_editor.origin.onclick == null) {
					ih = '<label>Link Text:</label><input value="' + link_editor.origin.innerHTML;
					//link_editor.ih_preset = link_editor.origin.href;
					TextEditor.ih_preset = link_editor.origin.href;
				}
				if (link_editor.origin.tagName.toLowerCase() == 'input') {
					ih = '<label>Link Text:</label><input value="' + link_editor.origin.value;
					if (link_editor.origin.getAttribute("store_link") == null) {
						link_editor.link_kind = 'virgin';
						link_editor.ih_preset = 'http://';
						TextEditor.ih_preset = 'http://';
					} else {
						link_editor.ih_preset = link_editor.origin.getAttribute("store_link");
						TextEditor.ih_preset = link_editor.origin.getAttribute("store_link");
					}
				}
				if (link_editor.origin.tagName.toLowerCase() == 'i') {
					ih = '<label>Link Text:</label><input value="' + link_editor.origin.getAttribute('to_link_text');
					link_editor.link_kind = 'virgin';
					link_editor.ih_preset = 'http://';
					TextEditor.ih_preset = 'http://';
				}


				if (TextEditor.ih_preset == '') {
					alert("t.onclick.toString().slice(t.onclick.toString().indexOf('slide_lr') + 9, t.onclick.toString().length - 3); TextEditor.ih_preset is empty");
				}


				switch (link_editor.link_kind) {
					case 'virgin':
						var secondfield = '<input value="' + link_editor.ih_preset + '" onkeyup="validate_link_target()"/>';
						break;
					case 'slide_lr':
					case 'search_nostyle':
						var secondfield = make_secondfield(link_editor.ih_preset);
						break;
					case 'jump_to':
						/*
														var link_target = this.link_kind + this.ih_preset;
						*/
						alert('jump_to comming soon');
						return;
						break;
					case '':
						alert('empty comming soon');
						return;
						break;
					default:
						var secondfield = '<input value="' + link_editor.ih_preset + '" onkeyup="validate_link_target()"/>';
						console.log('nothing to change , default');
				}

				ih += '" onkeyup="validate_link_ih(this)"/><br/><label>Link Ziel:</label>' + secondfield + '<i title="Link entfernen aber Text belassen." class="fa fa-minus-circle" style="position: absolute;left: 22%;" aria-hidden="true" onclick="remove_link()"></i><i class="fa fa-times-circle" aria-hidden="true" onclick="go_TextEditor()"></i>';
				if (link_editor.link_kind == 'virgin') {
					ih += '<div class="link_btn_raw">';
					if (t.tagName.toLowerCase() != 'input') {
						ih += '<button type="button" class="link_kind_btn" onclick="link_kind_response(this,1)"><i class="fa fa-picture-o" aria-hidden="true"></i> Bild</button>';
					}
					ih += '<button type="button" class="link_kind_btn" onclick="link_kind_response(this,2)"><i class="fa fa-file-text-o" aria-hidden="true"></i> Projekt</button>';
					ih += '<button type="button" class="link_kind_btn" onclick="link_kind_response(this,0)"><i class="fa fa-external-link" aria-hidden="true"></i> Webseite</button>';
					ih += '</div>';
				}
				ih += '<button type="button" class="ok_link_btn" id="confirm_link" onclick="ok_link(this)"><i class="fa fa-check" aria-hidden="true"></i>Ok, übernehmen</button>';
				come_TextEditor(ih, t);
			};

			var link_kind_response = function(t, i) {
				t.parentNode.style.display = 'none';
			};

			var link_kinds = ["virgin", "slide_lr", "search_nostyle", "jump_to", "external"];
			var link_kind_response = function(t, k) {
				link_editor.link_kind = link_kinds[k];
				console.log(link_editor.link_kind);
				if (link_editor.link_kind == 'slide_lr') {
					TextEditor.ih_preset = 'slide_lr' + 1;
					link_editor.ih_preset = 1;
					var c = document.createElement('div');
					c.innerHTML = make_secondfield(link_editor.ih_preset);
					TextEditor.insertBefore(c.children[0], TextEditor.children[4]);
					TextEditor.removeChild(TextEditor.children[5]);
					pre_drawArrow();
				}
				if (link_editor.link_kind == 'search_nostyle') {
					TextEditor.ih_preset = 'search_nostyle';
					link_editor.ih_preset = TextEditor.children[1].value;
					var c = document.createElement('div');
					c.innerHTML = make_secondfield(link_editor.ih_preset);
					TextEditor.insertBefore(c.children[0], TextEditor.children[4]);
					TextEditor.removeChild(TextEditor.children[5]);
				}
				t.parentNode.style.display = 'none';
			};


			var duplicate_to_linktext = function(t) {
				TextEditor.children[1].value = t.value;
				validate_link_target();
			};

			var go_TextEditor = function() {

				if (TextEditor.origin.tagName.toLowerCase() == 'i') {
					TextEditor.origin.parentNode.removeChild(TextEditor.origin);
				}

				link_editor = {};
				TextEditor.ih_preset = '';
				TextEditor.style.display = 'none';
				TextEditor.innerHTML = '';
				if (TextEditor.position) {
					/*    unmodify image_selector   */

					window.removeEventListener('DOMMouseScroll', mypreventDefault, false);
					window.onmousewheel = document.onmousewheel = null;
					window.onwheel = null;

					window.scrollTo(0, TextEditor.position);

					TextEditor.removeAttribute('position');

					document.getElementById('Images_display').lastChild.style.display = 'inline';

					document.getElementById('process_overlay').style.top = 0;

					var po = document.getElementById('process_overlay');
					if (po.children.length > 0) {
						po.removeChild(po.lastChild);
					}

					var link_selector = document.getElementById('image_selector');

					link_selector.style.opacity = 1;

					if (link_selector.children.length > 3) {
						link_selector.removeChild(link_selector.lastChild);

						for (var i = 0; i < link_selector.children.length; i++) {
							link_selector.children[i].style.display = 'inline-block';
						}
					}
				}
				document.getElementById('process_overlay').classList.remove('process_overlay_dark');
				document.body.style.background = '#fff';
				document.getElementById('Images_display').style.background = '#ccc';



			};

			var come_TextEditor = function(tx, t) {

				if (TextEditor.style.display != 'block' || TextEditor.origin != t) {

					TextEditor.innerHTML = tx;

					if (isSafari) {
						var se = TextEditor.getElementsByTagName('select');
						saf_align(Array.from(se));
						for (var i = 0; i < se.length; i++) {
							se[i].addEventListener("change", function() {
								saf_align(this);
							}, false);
						}
					}

					TextEditor.style.display = 'block';
					TextEditor.children[1].select();
					TextEditor.origin = t;
					document.getElementById('process_overlay').classList.add('process_overlay_dark');

					if (!isNaN(TextEditor.children[4].value)) {
						console.log('i pre_drawArrow');
						pre_drawArrow();

					}

				} else {
					go_TextEditor();
				}
			};

			var pre_drawArrow = function() {

				TextEditor.position = window.scrollY;

				document.getElementById('Images_display').scrollIntoView(false);

				window.addEventListener('DOMMouseScroll', mypreventDefault, false);
				window.onwheel = mypreventDefault; // modern standard
				window.onmousewheel = document.onmousewheel = mypreventDefault; // older browsers, IE


				var colorgap = 0 - document.getElementById('Images_display').offsetHeight + 'px';

				document.getElementById('process_overlay').style.top = colorgap;

				/*    modify image_selector   */

				document.getElementById('Images_display').lastChild.style.display = 'none';

				var link_selector = document.getElementById('image_selector');

				for (var i = 0; i < link_selector.children.length; i++) {
					link_selector.children[i].style.display = 'none';
				}

				var newItem = document.createElement("i");

				newItem.className = "fa fa-check";

				newItem.setAttribute("aria-hidden", "true");

				newItem.style.display = 'inline-block';

				newItem.style.padding = '3vw';

				newItem.style.cursor = 'pointer';

				newItem.setAttribute("onclick", "link_selector_callback(this)");

				link_selector.appendChild(newItem);

				link_selector.style.opacity = 0;


				canvArrow = document.createElement("canvas");

				canvArrow.disable = false;

				canvArrow.minreq = document.getElementById('Images_display').getBoundingClientRect().top;

				canvArrow.style.position = 'fixed';

				canvArrow.width = window.innerWidth;

				canvArrow.style.top = 'calc(50vh + ' + TextEditor.offsetHeight / 2 + 'px + 12px)';

				document.getElementById('process_overlay').appendChild(canvArrow);

				var canvas_ini = document.getElementById('Images_display').children[TextEditor.children[4].value].getBoundingClientRect();
				canvArrow.arr = [(canvas_ini.left + canvas_ini.right) / 2, canvas_ini.top + 60];

				drawArrow(canvArrow.arr);

				window.addEventListener("mousemove", drawArrow, false);

			};

			var drawArrow = function(e) {


				if (e.clientY > canvArrow.minreq && !canvArrow.disable) {
					var x = e.clientX;
					var y = e.clientY - (window.innerHeight + TextEditor.offsetHeight) / 2 - 30;

				} else {

					var x = canvArrow.arr[0];
					var y = canvArrow.arr[1] - (window.innerHeight + TextEditor.offsetHeight) / 2 - 30;

				}

				canvArrow.height = y;

				var ctx = canvArrow.getContext("2d");

				var curv = Math.abs(x - window.innerWidth / 2) / 5;

				ctx.clearRect(0, 0, canvArrow.width, canvArrow.height);

				ctx.beginPath();

				ctx.fillStyle = ctx.strokeStyle = 'rgba(141, 170, 212, 1)';
				ctx.moveTo(canvArrow.width / 2, 4);
				ctx.lineTo(canvArrow.width / 2 - 6, 24);
				ctx.lineTo(canvArrow.width / 2 + 6, 24);
				ctx.lineTo(canvArrow.width / 2, 4);
				ctx.fill();

				ctx.lineWidth = 6;
				ctx.lineCap = "round";
				ctx.moveTo(canvArrow.width / 2, 24);
				ctx.bezierCurveTo(canvArrow.width / 2, canvArrow.height / 2 + 9 + curv, x, canvArrow.height / 2 + 9 - curv, x, canvArrow.height - 6);
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(x, canvArrow.height - 14, 12, 0, 2 * Math.PI);
				ctx.fill();

			};

			var link_selector_callback = function(t) {

				t.parentNode.style.opacity = 1;
				canvArrow.disable = true;
				setTimeout(function() {
					if (t.parentNode) {
						t.parentNode.style.opacity = 0;
					}
					canvArrow.disable = false;
				}, 2000);

				TextEditor.children[4].value = document.getElementById('image_selector').store_img;

				validate_link_target();
			};

			function mypreventDefault(e) {
				e = e || window.event;
				if (e.preventDefault)
					e.preventDefault();
				e.returnValue = false;
			}


			var remove_link = function(t) {

				console.log(TextEditor.origin.tagName.toLowerCase());

				if (TextEditor.origin.tagName.toLowerCase() == 'input') {

					alert('comming soon');

				} else {


					if (TextEditor.origin.tagName.toLowerCase() == 'a') {
						console.log(TextEditor.origin);

						var textnode = document.createTextNode(TextEditor.children[1].value); // Create a text node
						TextEditor.origin.parentNode.insertBefore(textnode, TextEditor.origin);
						TextEditor.origin.parentNode.removeChild(TextEditor.origin);

						validate(textnode.parentNode, textnode.parentNode.nextSibling);

						go_TextEditor();

					} else {

						alert('comming soon');

					}

				}

			};


			var ok_link = function(t) {

				if (TextEditor.origin.tagName.toLowerCase() == 'input') {

					TextEditor.origin.value = TextEditor.children[1].value;
					TextEditor.origin.removeAttribute("store_link");
					TextEditor.origin.setAttribute("store_link", TextEditor.children[4].value);
					validate(TextEditor.origin, TextEditor.origin.parentNode.nextSibling);

				} else {

					console.log('ok_link link_editor.link_kind: ', link_editor.link_kind);

					if (TextEditor.origin.tagName.toLowerCase() == 'i') {

						var instr = TextEditor.origin.nextSibling.innerHTML;
						var ix = TextEditor.origin.getAttribute('to_link_text_start');

						if (link_editor.link_kind == 'slide_lr') {
							//<a class="line" onclick="slide_lr(12)">«Der Mensch als Industriepalast»</a>
							TextEditor.origin.nextSibling.innerHTML = instr.substr(0, ix) + instr.substr(ix).replace(TextEditor.origin.getAttribute('to_link_text'), '<a class="line" onclick="slide_lr(' + TextEditor.children[4].value + ')">' + TextEditor.children[1].value + '</a>');

						} else {


							if (link_editor.link_kind == 'search_nostyle') {

								TextEditor.origin.nextSibling.innerHTML = instr.substr(0, ix) + instr.substr(ix).replace(TextEditor.origin.getAttribute('to_link_text'), '<a class="line" onclick="search_nostyle(this)">' + TextEditor.children[1].value + '</a>');

							} else {

								TextEditor.origin.nextSibling.innerHTML = instr.substr(0, ix) + instr.substr(ix).replace(TextEditor.origin.getAttribute('to_link_text'), '<a href="' + TextEditor.children[4].value + '" target="_blank">' + TextEditor.children[1].value + '</a>');

							}

						}

						TextEditor.origin.removeAttribute("to_link_text");
						TextEditor.origin.removeAttribute("to_link_text_start");

						validate(TextEditor.origin.nextSibling, TextEditor.origin.nextSibling.nextSibling);

					} else {
						//					console.log('TextEditor.ih_preset: ', TextEditor.ih_preset);
						TextEditor.origin.innerHTML = TextEditor.children[1].value;

						if (link_editor.link_kind == 'slide_lr') {
							//if (!isNaN(TextEditor.children[4].value)) {
							//TextEditor.origin.removeAttribute("onclick");
							TextEditor.origin.setAttribute("onclick", "slide_lr(" + TextEditor.children[4].value + ")");
							/*
													TextEditor.origin.addEventListener("click", function(event) {
														sh_link_editor(this);
													}, false);
							*/


						} else {
							//TextEditor.origin.setAttribute("onclick", "search_nostyle(" + TextEditor.children[4].value + ")");
						}

						validate(TextEditor.origin, TextEditor.origin.parentNode.nextSibling);

					}

				}
				go_TextEditor();
			};

			/*
				go_TextEditor();
			};

			/*******    end textpart editor functions   *******/

			var func_after_Image;


			var load_additional_images = function(c) {

				var try_img = new Image();

				try_img.count = c;

				try_img.onerror = function() {

					temp_ih += '<i class="fa fa-plus-circle add_image_but" aria-hidden="true" onclick="add_image(this)"></i>';

					document.getElementById('Images_display').innerHTML = temp_ih;

					var dc = document.getElementById('Images_display').children;
					for (var i = 1; i < dc.length - 1; i++) {
						dc[i].addEventListener("mouseover", function() {
							come_selector(this);
						}, false);
					}

					document.getElementById('Images_display').style.height = document.getElementById('Images_display').offsetHeight + 'px';
					temp_ih = '';

					if (!update_image_links.dat) {
						func_after_Image();
						console.log('all done this is func_after_Image and it is the last func');
					} else {
						update_links_after_images();
					}



				};

				try_img.onload = function() {
					temp_ih += '<img ondrop="drop(event)" ondragover="allowDrop(event)" src="' + try_img.src + '" />';
					var c = this.count;
					c++;
					load_additional_images(c);
				};

				try_img.src = 'images/mobile/' + to_edit_folder + '/' + to_edit.comp_name + '_' + c + '.jpg?zuza' + Math.floor(Math.random() * (1000) + 1);
			};

			var make_all_search = function(p) {
				/*

				*/
				for (var i = 0; i < folders.length; i++) {
					if (folders[i].data[p] && folders[i].data[p].search) {
						for (var y = 0; y < folders[i].data[p].search.length; y++) {
							all_search.term.push(folders[i].data[p].search[y]);
							all_search.position.push(folders[i].data[p].name);
						}
					}
				}

			};

			/*

						var make_projectlist = function(p, employee) {
							for (var i = 1; i < folders.length; i++) {
								if (folders[i].data[p] && folders[i].data[p].epilog.Impressum) {
									for (key in folders[i].data[p].epilog.Impressum) {

										if (folders[i].data[p].epilog.Impressum[key].indexOf(employee) != -1 && projectlist.indexOf(folders[i].data[p].name) == -1) {
											projectlist.push(folders[i].data[p].name);
										}


									}
								}
							}

						};

						var projectlist = [];

			*/


			var getvals = function() {


				//loadXMLDoc('inhalt.js', function() { // org (inhalt.js)
				loadXMLDoc('inhalt.js', function() { // get json data on load

					if (xmlhttp.readyState == 4) {
						if (xmlhttp.status == 200) {

							folders = JSON.parse(xmlhttp.responseText).folders;

							for (var i = 0; i < folders.length; i++) {


								if (typeof folders[i].data[0].time !== 'undefined') {

									folders[i].data.sort(function(a, b) {

										return b.time.from[2] - a.time.from[2];

									});
								}

								if (largest < folders[i].data.length) {
									largest = folders[i].data.length;
								}


								document.getElementById('basis').innerHTML += '<th>' + folders[i].menu_name + '<i class="fa fa-plus-circle" aria-hidden="true" onclick="new_entry(this)"></i></th>';

							}

							var taxi = decodeURI(window.location.search.substring(1));

							var p = -1;
							var cycle = function(c) {
								p++;
								var ih = '';
								for (var i = 0; i < folders.length; i++) {
									var id = (typeof folders[i].data[p] !== 'undefined' && taxi == folders[i].data[p].comp_name) ? ' id="edit_preset"' : '';
									ih += (typeof folders[i].data[p] !== 'undefined') ? '<td class="lk"' + id + ' onclick="edit(this)" f="' + i + '" d="' + p + '">' + folders[i].data[p].name + '</td>' : '<td></td>';
								}

								return ih;
							};


							var new_raw = '<tr>';


							all_search = {
								"term": [],
								"position": []
							};


							for (var j = 0; j < largest; j++) {
								//console.log('cycle ',);
								new_raw += cycle(j) + '</tr><tr>';
								make_all_search(j);
								//make_projectlist(j, 'Ronny Trachsel (palma3)');
							}

							//console.log(projectlist);


							new_raw += '</tr>';

							document.getElementById('basis').parentNode.innerHTML += new_raw;

							document.getElementById('process_overlay').classList.remove('process_overlay_dark');

							document.getElementById('process_overlay').addEventListener("animationstart", function() {
								document.body.style.background = '#000';
								if (typeof TextEditor.ih_preset !== 'undefined' && TextEditor.ih_preset.indexOf('slide_lr') != -1) {
									document.getElementById('Images_display').style.background = '#000';
								}
							}, false);


							TextEditor = document.getElementById('text_editor');

							Positioner = document.getElementById('positioner');

							Unsaved = document.getElementById('unsaved');

							Unsaved.addEventListener("mouseover", function() {
								this.style.width = this.style.height = 'auto';
								this.style.marginRight = '-30px';
								this.firstChild.style.marginRight = '30px';
							}, false);

							Unsaved.addEventListener("mouseout", function() {
								this.style.width = this.style.height = '18px';
								this.style.marginRight = this.firstChild.style.marginRight = 0;
							}, false);

							if (logged_user) {
								var u = logged_user.split('@')[0].replace('.', ' ').replace('juer', 'jür').replace(/\b\w/g, function(l) {
									return l.toUpperCase();
								});
								document.getElementById('username').innerHTML = '... bedient von: ' + u + '<i class="fa fa-sign-out" aria-hidden="true" title="abmelden" onclick="logout()"></i>';
							}

							var bg_prel = new Image();

							bg_prel.src = 'images/editor_new_image.jpg';

							//page_load();

							/*******    and redirect to entry if taxi is valid and not empty   *******/

							if (document.getElementById('edit_preset')) {
								edit(document.getElementById('edit_preset'));
							}




						} else {
							alert('inhalt shit happens');
						}
					}
				});

				window.addEventListener("scroll", observe_actual_chapter, false);

			};

			var logout = function() {
				window.location.href = 'login/logout.php';
			};

			var observe_actual_chapter = function() {
				if (document.getElementById('all_cells').getElementsByClassName('fa-minus-circle')[0]) {
					if (document.getElementById('all_cells').getElementsByClassName('fa-minus-circle')[0].getBoundingClientRect().top < 0) {
						document.getElementById('actual_chapter').innerHTML = '(' + to_edit.name + ')';
					} else {
						document.getElementById('actual_chapter').innerHTML = '';
					}
				}
			};

			function allowDrop(ev) {
				if (disable_img_over) {
					return false;
				}
				ev.preventDefault();
			}

			function drag(ev) {
				if (disable_img_over) {
					return false;
				}
				ev.dataTransfer.setData("text", ev.target.id);
				//				console.log(ev.target.id);
				console.log('to_edit_image second call: ', to_edit_image);
				ev.target.style.backgroundImage = 'url(' + to_edit_image + ')';
			}

			function drop(ev) {
				if (disable_img_over) {
					return false;
				}
				ev.preventDefault();
				var data = ev.dataTransfer.getData("text");
				//ev.target.appendChild(document.getElementById(data));
				document.getElementById('image_selector').style.backgroundImage = 'none';
				document.getElementById('image_selector').style.display = 'none';
				//document.getElementById('process_overlay').classList.add('process_overlay_dark');
				//console.log('got store_img: ',document.getElementById('image_selector').store_img);

				swap = [to_edit.comp_name + '_' + document.getElementById('image_selector').store_img, to_edit.comp_name + '_' + index_in_parent(ev.target)];

				var json = JSON.stringify({
					"folder": to_edit_folder,
					"one": swap[0],
					"two": swap[1]
				});

				swap_image_positions(json);


			}

			var run_swap_multiples = false;
			var swap_multiples = function(o) {

				if (o < document.getElementById('Images_display').children.length - 2) {


					swap = [to_edit.comp_name + '_' + o, to_edit.comp_name + '_' + parseInt(o + 1)];

					var json = JSON.stringify({
						"folder": to_edit_folder,
						"one": swap[0],
						"two": swap[1]
					});

					swap_image_positions(json);

				} else {

					swap = [to_edit.comp_name + '_' + o];

					var json = JSON.stringify({
						"folder": to_edit_folder,
						"one": swap[0]
					});

					loadXMLDoc('scripts/delete_img.php', function() { // swap image names (numbers) on server

						if (xmlhttp.readyState == 4) {
							if (xmlhttp.status == 200) {

								run_swap_multiples = false;

								console.log('oki, done swap_multiples and delete', xmlhttp.responseText); // output php echo for control
								temp_ih = '<img src="images/mobile/' + to_edit_folder + '/' + to_edit.comp_name + '.jpg" />';
								load_additional_images(1);

							} else {
								alert('delete_img shit happens');
							}
						}

					}, json);



				}

			};

			function WebPEncDemo() {

				var encInCanvas = document.getElementById("encoderInputCanvas"),
					encInContext = encInCanvas.getContext("2d"),
					img = document.createElement("img"),
					encOutputWebPImage = document.getElementById('encOutputWebPImage'),
					base64URI = '';

				var freader = new FileReader();

				freader.onload = function(evt) {

					img.onload = function() {
						encInContext.clearRect(0, 0, encInCanvas.width, encInCanvas.height);
						encInCanvas.width = this.width;
						encInCanvas.height = this.height;
						encInContext.drawImage(img, 0, 0);

						WebPEncodeAndDraw(80);

					};

					img.crossOrigin = 'anonymous';

					img.src = evt.target.result;

				};

				freader.readAsDataURL(save_image_presets[0]);

				WebPEncodeAndDraw = function(qualityVal) {
					//24bit data (alpha coming soon)
					var input = encInContext.getImageData(0, 0, encInCanvas.width, encInCanvas.height);
					var w = input.width,
						h = input.height;
					var inputData = input.data;
					var out = {
						output: ''
					};

					//CODE START
					var encoder = new WebPEncoder();

					//Config, you can set all arguments or what you need, nothing no objeect
					var config = new Object();

					config.target_size = 0; // if non-zero, set the desired target size in bytes. Takes precedence over the 'compression' parameter.
					config.target_PSNR = 0.; // if non-zero, specifies the minimal distortion to	try to achieve. Takes precedence over target_size.
					config.method = 4; // quality/speed trade-off (0=fast, 6=slower-better)    //  was method
					config.sns_strength = 50; // Spatial Noise Shaping. 0=off, 100=maximum.
					config.filter_strength = 20; // range: [0 = off .. 100 = strongest]
					config.filter_sharpness = 0; // range: [0 = off .. 7 = least sharp]
					config.filter_type = 1; // filtering type: 0 = simple, 1 = strong (only used if filter_strength > 0 or autofilter > 0)
					config.partitions = 0; // log2(number of token partitions) in [0..3] Default is set to 0 for easier progressive decoding.
					config.segments = 4; // maximum number of segments to use, in [1..4]
					config.pass = 1; // number of entropy-analysis passes (in [1..10]).
					config.show_compressed = 0; // if true, export the compressed picture back. In-loop filtering is not applied.
					config.preprocessing = 0; // preprocessing filter (0=none, 1=segment-smooth)
					config.autofilter = 0; // Auto adjust filter's strength [0 = off, 1 = on]
					//   --- description from libwebp-C-Source Code ---
					config.extra_info_type = 0; // print extra_info
					config.preset = 1 //0: default, 1: picture, 2: photo, 3: drawing, 4: icon 5: text

					//set Config; default config -> WebPConfig( null )
					encoder.WebPEncodeConfig(config); //when you set the config you must it do for every WebPEncode... new

					//start encoding
					var size = encoder.WebPEncodeRGBA(inputData, w, h, w * 4, qualityVal, out); //w*4 desc: w = width, 3:RGB/BGR, 4:RGBA/BGRA
					//CODE END

					base64URI = btoa(out.output);

					/*    prepare json and upload_file   */

					/*    extension   */

					var webp_json = JSON.stringify({
						"folder": 'webp/' + save_image_presets[2],
						"name": save_image_presets[1].replace('.jpg', '.webp'),
						"base": base64URI
					});

					loadXMLDoc('scripts/upload_webp.php', function() { // swap image names (numbers) on server

						if (xmlhttp.readyState == 4) {
							if (xmlhttp.status == 200) {

								console.log('oki, webp save done', xmlhttp.responseText); // output php echo for control

								temp_ih = '<img src="images/mobile/' + to_edit_folder + '/' + to_edit.comp_name + '.jpg" />';
								load_additional_images(1);
								close_image_editor();
								save_image_presets = [];

							} else {
								alert('upload_file (webp) shit happens');
							}
						}

					}, webp_json);

					/*    end upload_file   */

				};

			};

			function CopyToClipboard() {
				//var input = document.getElementById ("toClipboard");
				var textToClipboard = 'dummytext';
				copied = 'nix';
				var success = true;
				if (window.clipboardData) { // Internet Explorer
					window.clipboardData.setData("Text", textToClipboard);
					copied = textToClipboard + " ie";
				} else {
					// create a temporary element for the execCommand method
					forExecElement = CreateElementForExecCommand(textToClipboard);

					/* Select the contents of the element 
					    (the execCommand for 'copy' method works on the selection) */
					SelectContent(forExecElement);

					var supported = true;

					// UniversalXPConnect privilege is required for clipboard access in Firefox
					try {
						if (window.netscape && netscape.security) {
							netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
						}

						// Copy the selected content to the clipboard
						// Works in Firefox and in Srefox and in Safari before version 5
						copied = forExecElement.textContent;
						success = document.execCommand("copy", false, null);
					} catch (e) {
						copied = forExecElement.textContent;
						success = false;
					}

					// remove the temporary element
					//document.body.removeChild(forExecElement);
				}

				if (success) {
					console.log("The text is on the clipboard, try to paste it! " + copied + " und " + success);
				} else {
					console.log("Your browser doesn't allow clipboard access! " + copied + " und " + success);
				}
			}

			var copied = 'nix';
			var forExecElement;

			function CreateElementForExecCommand(textToClipboard) {
				var forExecElement = document.createElement("div");
				// place outside the visible area
				forExecElement.style.position = "absolute";
				forExecElement.style.left = "100px";
				forExecElement.style.top = "100px";
				forExecElement.style.background = "#f00";
				// write the necessary text into the element and append to the document
				forExecElement.textContent = textToClipboard;
				document.body.appendChild(forExecElement);
				// the contentEditable mode is necessary for the  execCommand method in Firefox
				forExecElement.contentEditable = true;

				return forExecElement;
			}

			function SelectContent(element) {
				// first create a range
				var rangeToSelect = document.createRange();
				rangeToSelect.selectNodeContents(element);

				// select the contents
				var selection = window.getSelection();
				selection.removeAllRanges();
				selection.addRange(rangeToSelect);
			}