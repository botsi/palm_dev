			var folders, to_edit, to_edit_folder, to_edit_image, swap, save_image_presets, TextEditor;

			/*
						var uploadtimerId, upseconds = 0;
			*/

			var disable_img_over = false;

			var temp_ih = '';

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

				//t.style.display = "none";

				come_selector(t);


			};


			/******           swap_image_positions           ******/

			var swap_image_positions = function(json) {

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

				document.getElementById('Images_display').lastChild.style.display = 'inline';

				disable_img_over = false;

			};


			/******           preview image           ******/

			var preview_image = function(t) {
				console.log(t.value);

				document.getElementById('image_editor').getElementsByTagName('img')[0].src = t.value;
				//document.getElementById('image_editor').style.display = 'none';


				var oFReader = new FileReader();
				oFReader.readAsDataURL(t.files[0]);

				oFReader.onload = function(oFREvent) {
					document.getElementById('image_editor').getElementsByTagName('img')[0].src = oFREvent.target.result;

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

					if (errors.length > 0) {

						t.nextSibling.nextSibling.innerHTML = 'i stop here because ...<br/>';

						for (var i = 0; i < errors.length; i++) {
							t.nextSibling.nextSibling.innerHTML += errors[i] + '<br/>';
						}

						t.nextSibling.nextSibling.innerHTML += 'Sie können ein anderes Bild hierher ziehen oder den Bildeditor <button type="button" onclick="close_image_editor()">schliessen</button>';

					} else {

						save_image_presets = [t.files[0], to_edit.comp_name + '_' + document.getElementById('image_selector').store_img + '.jpg', to_edit_folder];

						//save_image_presets = [t.files[0], to_edit.comp_name + to_edit_image.substring(to_edit_image.indexOf("_"), to_edit_image.indexOf("?") - 3) + 'jpg', to_edit_folder];

						t.nextSibling.nextSibling.innerHTML = '<button type="button" onclick="upload_file(this)">speichern</button>' + file.name;

					}

				};



			};

			var upload_file = function(t) {

				t.parentNode.classList.add('img_uploader_active');

				/*
								uploadtimerId = setInterval(function() {
									upseconds++;
									console.log('upseconds: ', upseconds);
								}, 500);
				*/

				t.parentNode.innerHTML = ' ... bitte warten ...';

				console.log(document.getElementById('image_selector').store_img);
				console.log(save_image_presets[0]);
				console.log(save_image_presets[1]);
				console.log(save_image_presets[2]);
				/*
				 */

				//console.log(save_image_presets[0].size);

				var fd = new FormData();
				fd.append("upload_file", save_image_presets[0], save_image_presets[1]);
				fd.append('extraParam', save_image_presets[2]);
				//fd.append('extraParam','test');


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

			var edit_image = function(img) {

				document.getElementById('image_selector').style.backgroundImage = 'none';
				document.getElementById('image_selector').style.display = 'none';

				document.getElementById('Images_display').lastChild.style.display = 'none';


				disable_img_over = true;

				if (!img) {
					document.getElementById('image_editor').innerHTML = '<p><i class="fa fa-times-circle" aria-hidden="true" onclick="close_image_editor()"></i></p><input type="file" id="myFile" onchange="preview_image(this)"><img src="' + to_edit_image +
						'" /><p>neues Bild hierher ziehen ...</p>';
				} else {
					//console.log('value: ', img, ' und ', document.getElementById('image_selector').store_img);
					document.getElementById('image_editor').innerHTML = '<p><i class="fa fa-times-circle" aria-hidden="true" onclick="close_image_editor()"></i></p><input type="file" id="myFile" onchange="preview_image(this)"><img src="images/editor_new_image.jpg" /><p>neues Bild hierher ziehen ...</p>';
				}
				document.getElementById('image_editor').style.display = 'block';

			};

			/******           come selector           ******/

			var come_selector = function(t) {

				if (disable_img_over) {
					return false;
				}

				if (t.tagName.toLowerCase() != 'img') {
					var s = t.previousSibling.src.split('_')[0];
					//console.log(s + 1);
					to_edit_image = s + '_' + index_in_parent(t) + '.jpg';
					//console.log(to_edit_image);

					document.getElementById('image_selector').store_img = index_in_parent(t);
					edit_image('value');
					return;
				} else {
					to_edit_image = t.src;
					//console.log(to_edit_image);

					document.getElementById('image_selector').store_img = index_in_parent(t);
				}

				//console.log('to_edit_image first call: ', to_edit_image);

				document.getElementById('image_selector').style.left = t.offsetLeft + 'px';
				document.getElementById('image_selector').style.top = t.offsetTop + 'px';
				document.getElementById('image_selector').style.display = 'flex';
			};


			/******           validate           ******/

			var validate = function(t, b) {
				var value = (t.tagName.toLowerCase() == 'input') ? t.value : t.innerHTML;
				if (value == '' || value == ' ' || value.indexOf('eval(') != -1) {
					b.classList.remove('button_valid');
					//console.log('nicht akzeptiert', value.indexOf('"'));
					//console.log(value.charAt(value.indexOf('"') - 6), value.charAt(value.indexOf('"') - 5), value.charAt(value.indexOf('"') - 4), value.charAt(value.indexOf('"') - 3), value.charAt(value.indexOf('"') - 2), value.charAt(value.indexOf('"') - 1), value.charAt(value.indexOf('"')));
				}
				console.log(value, 'i validate');
				b.classList.add('button_valid');
			};


			/******           remove impressum key           ******/

			var remove_impressum_key = function(t) {
				console.log(t.previousSibling.className);
				/*
								document.getElementById('Impressum_display').removeChild(t.previousSibling);
								document.getElementById('Impressum_display').removeChild(t);
				*/
			};


			/******           remove impressum value           ******/

			var remove_impressum_value = function(t) {
				console.log(t.nextSibling.tagName);
				if (t.previousSibling.previousSibling.previousSibling.className != 'keyfield' || (t.nextSibling && t.nextSibling.tagName.toLowerCase() != 'br')) {
					t.parentNode.nextSibling.classList.add('button_valid');
					document.getElementById('Impressum_display').removeChild(t.previousSibling);
					document.getElementById('Impressum_display').removeChild(t);
				}
			};


			/******           remove search item           ******/

			var remove_search_item = function(t) {
				document.getElementById('search_display').removeChild(t.previousSibling);
				document.getElementById('search_display').removeChild(t);
			};




			/******           remove entry           ******/

			var remove_entry = function(t) {
				alert('remove_entry: ');
			};


			/******           new entry           ******/

			var new_entry = function(t) {
				alert('new_entry: ');
			};


			/******           replace entry           ******/

			var save_existing = function(t) {

				t.classList.remove('button_valid');

				/******           overlay (disable other precess)           ******/
				document.getElementById('process_overlay').classList.add('process_overlay_dark');

				var entry_kind = t.previousSibling.id.replace('_display', '');

				switch (entry_kind) {
					case 'name':
						to_edit[entry_kind] = t.previousSibling.value.replace(/(?:\r\n|\r|\n)/g, '<br/>');
						/* update table */
						var lks = document.getElementById('all_cells').getElementsByClassName('lk');
						for (var i = 0; i < lks.length; i++) {
							//console.log('lks content: ', lks[i].innerHTML);
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
							a.push(els[i].value);
						}
						to_edit[entry_kind] = a;
						break;
					case 'text':
						to_edit[entry_kind] = t.previousSibling.innerHTML;
						break;
					case 'time':
						var a = [];
						var els = t.previousSibling.getElementsByTagName('input');
						if (els.length == 3) {
							for (var i = 0; i < els.length; i++) {
								a.push(els[i].value);
							}
							to_edit[entry_kind].from = a;
						}
						if (els.length == 6) {
							var b = [];
							for (var i = 0; i < 3; i++) {
								a.push(els[i].value);
								b.push(els[i + 3].value);
							}
							to_edit[entry_kind].from = a;
							to_edit[entry_kind].till = b;
						}
						break;
					case 'Ausstellungsort':
						var a = [];
						to_edit.epilog[entry_kind] = a;
						break;
					case 'Impressum':
						var a = {};
						var els = t.previousSibling.getElementsByTagName('input');
						for (var i = 0; i < els.length; i += 2) {
							a[els[i].value] = els[i + 1].value;
						}
						to_edit.epilog[entry_kind] = a;
						break;
					case 'Ausstellungskonzept':
						to_edit.epilog[entry_kind] = t.previousSibling.innerHTML;
						break;
					default:
						alert('no save_existing handling defined');
				}

				console.log(to_edit);

				var newtext = JSON.stringify({
					"folders": folders
				});

				//console.log(newtext);

				loadXMLDoc('scripts/new_e.php', function() { // save changed json data to server

					if (xmlhttp.readyState == 4) {
						if (xmlhttp.status == 200) {

							console.log('oki, done', xmlhttp.responseText); // output php echo for control
							/******           end overlay           ******/
							document.getElementById('process_overlay').classList.remove('process_overlay_dark');
						} else {
							alert('new_e shit happens');
						}
					}
				}, newtext);

			};

			/******         end replace entry         ******/



			var edit = function(t) {

				var ac = document.getElementById('all_cells').getElementsByTagName('td');

				for (var i = 0; i < ac.length; i++) {

					ac[i].style.background = 'rgba(0,0,0,0)';

					if (ac[i].children.length > 0) {
						ac[i].removeChild(ac[i].children[0]);
					}

				}

				t.style.background = 'rgba(141, 170, 212, 0.9)';

				t.innerHTML += '<i class="fa fa-minus-circle" aria-hidden="true" onclick="remove_entry(this)"></i>';

				to_edit = folders[t.getAttribute('f', 0)].data[t.getAttribute('d', 0)];

				to_edit_folder = folders[t.getAttribute('f', 0)].name;

				observe_actual_chapter();

				var input_attributes = ' type="text" onkeyup="validate(this,this.parentNode.nextSibling)"';

				/******           main data           ******/

				document.getElementById('name_display').value = to_edit.name;

				document.getElementById('prolog_display').value = to_edit.prolog.replace(/<br\s*\/?>/mg, "\n");

				/******           search           ******/

				if (to_edit.search && Array.isArray(to_edit.search)) {

					document.getElementById('search_display').innerHTML = '<span>das erste Stichwort wird aus dem Namen / Titel generiert</span><span>fügen Sie bisher auf der Seite nicht vorkommende, passende Stichworte hinzu ...</span><br/>';

					//		add comp_name

					document.getElementById('search_display').innerHTML += '<input' + input_attributes + ' value="' + to_edit.comp_name + '" />';

					if (to_edit.name.toLowerCase().replace(/ /g, '') != to_edit.comp_name) {

						//		add name

						document.getElementById('search_display').innerHTML += '<input' + input_attributes + ' value="' + to_edit.name.toLowerCase().replace(/ /g, '') + '" />';

					}

					for (var j = 0; j < to_edit.search.length; j++) {
						document.getElementById('search_display').innerHTML += '<input' + input_attributes + ' value="' + to_edit.search[j] + '" /><i class="fa fa-minus-circle" aria-hidden="true" onclick="remove_search_item(this)"></i>';
					}
				}

				/******           text           ******/

				document.getElementById('text_display').innerHTML = to_edit.text; //.replace(/<br\s*\/?>/mg, "\n");
				add_text_editor_funcs(document.getElementById('text_display'));

				/******           time           ******/

				document.getElementById('time_display').innerHTML = '';
				if (typeof to_edit.time !== 'undefined') {
					document.getElementById('time_display').innerHTML = '<input' + input_attributes + ' value="' + to_edit.time.from[0] + '" />' + '<input' + input_attributes + ' value="' + to_edit.time.from[1] + '" />' + '<input' + input_attributes + ' value="' +
						to_edit.time.from[2] + '" />';
					if (typeof to_edit.time.till !== 'undefined') {
						document.getElementById('time_display').innerHTML += ' bis ' + '<input' + input_attributes + ' value="' + to_edit.time.till[0] + '" />' + '<input' + input_attributes + ' value="' + to_edit.time.till[1] + '" />' + '<input' + input_attributes +
							' value="' + to_edit.time.till[2] +
							'" />';
					}
				} else {
					document.getElementById('time_display').value = '';
				}

				/******           epilog data           ******/

				/******           Ausstellungsort           ******/

				document.getElementById('Ausstellungsort_display').innerHTML =
					'<span>von / bis (wenn mehrere Daten)</span><span>Veranstaltungsort</span><span>Strasse und Hausnummer</span><span>Postleitzahl und Ort</span><span>Land (wenn nicht Schweiz)</span><span>Webseite</span><span>GoogleMaps kurz-url</span>';
				if (to_edit.epilog && to_edit.epilog.Ausstellungsort && Array.isArray(to_edit.epilog.Ausstellungsort)) {
					//document.getElementById('Ausstellungsort_display').innerHTML +=
					for (var j = 0; j < to_edit.epilog.Ausstellungsort.length; j++) {
						document.getElementById('Ausstellungsort_display').innerHTML += '<input' + input_attributes + ' value="' + to_edit.epilog.Ausstellungsort[j][0] + '" />' + '<input' + input_attributes + ' value="' + to_edit.epilog.Ausstellungsort[j][1] +
							'" />' +
							'<input' + input_attributes + ' value="' + to_edit.epilog.Ausstellungsort[j][2] + '" />' + '<input' + input_attributes + ' value="' + to_edit.epilog.Ausstellungsort[j][3] + '" />' + '<input' + input_attributes + ' value="' + to_edit.epilog.Ausstellungsort[
								j][4] + '" />' +
							'<input' + input_attributes + ' value="' + to_edit.epilog.Ausstellungsort[j][5] + '" />' + '<input' + input_attributes + ' value="' + to_edit.epilog.Ausstellungsort[j][6] + '" /><br/>';
					}

				} else {

					if (to_edit.epilog && to_edit.epilog.Projektort && Array.isArray(to_edit.epilog.Projektort)) {
						for (var j = 0; j < to_edit.epilog.Projektort.length; j++) {
							document.getElementById('Ausstellungsort_display').innerHTML += '<input' + input_attributes + ' value="' + to_edit.epilog.Projektort[j][0] + '" />' + '<input' + input_attributes + ' value="' + to_edit.epilog.Projektort[j][1] + '" />' +
								'<input' + input_attributes + ' value="' +
								to_edit.epilog.Projektort[j][2] + '" />' + '<input' + input_attributes + ' value="' + to_edit.epilog.Projektort[j][3] + '" />' + '<input' + input_attributes + ' value="' + to_edit.epilog.Projektort[j][4] + '" />' + '<input' +
								input_attributes + ' value="' + to_edit.epilog.Projektort[
									j][5] + '" />' + '<input' + input_attributes + ' value="' + to_edit.epilog.Projektort[j][6] + '" /><br/>';
						}
					}
				}

				/******           Impressum           ******/

				//document.getElementById('Impressum_display').innerHTML = '';
				//var temp_ih = '';

				if (to_edit.epilog && to_edit.epilog.Impressum) {
					for (var key in to_edit.epilog.Impressum) {
						temp_ih += '<input' + input_attributes + ' value="' + key + '" class="keyfield" /><i class="fa fa-minus-circle" aria-hidden="true" onclick="remove_impressum_key(this)"></i>';
						for (var j = 0; j < to_edit.epilog.Impressum[key].length; j++) {
							temp_ih += '<input' + input_attributes + ' value="' + to_edit.epilog.Impressum[key][j] + '" /><i class="fa fa-minus-circle" aria-hidden="true" onclick="remove_impressum_value(this)"></i>';
						}
						temp_ih += '<br/>';
						//document.getElementById('Impressum_display').innerHTML += '<input' + input_attributes + ' value="' + key + '" /><input' + input_attributes + ' value="' + to_edit.epilog.Impressum[key] + '" /><br/>';
					}

					document.getElementById('Impressum_display').innerHTML = temp_ih;
					temp_ih = '';

				}

				/******           Ausstellungskonzept           ******/

				document.getElementById('Ausstellungskonzept_display').innerHTML = '';
				if (to_edit.epilog && to_edit.epilog.Ausstellungskonzept) {
					document.getElementById('Ausstellungskonzept_display').innerHTML = to_edit.epilog.Ausstellungskonzept;
					add_text_editor_funcs(document.getElementById('Ausstellungskonzept_display'));
				}

				/******           Images           ******/

				document.getElementById('image_selector').style.display = 'none';
				temp_ih = '<img src="images/mobile/' + to_edit_folder + '/' + to_edit.comp_name + '.jpg" />';
				load_additional_images(1);

				/******           done, now make editor_fields_container visible          ******/

				document.getElementById('editor_fields_container').style.display = 'block';

			};

			/*******    textpart editor functions   *******/

			var add_text_editor_funcs = function(el) {

				console.log(el.id);

				//if (el.id == 'Ausstellungskonzept_display') {
				console.log('a s length: ', el.querySelectorAll('a').length);

				var as = el.querySelectorAll('a');
				for (var i = 0; i < as.length; i++) {
					console.log(as[i].onclick);

					// exclude textparts who have allready onclick

					//					if (as[i].onclick == null) {

					as[i].addEventListener("click", function(event) {
						sh_link_editor(this);
					}, false);
					/*
										}else{

											as[i].addEventListener("click", function(event) {
												sh_link_editor(this);
											}, false);

										}
					*/
				}
				//}

			};

			/*******    textparts who have allready onclick   *******/


			var jump_to = function(f, s) {
				TextEditor.ih_preset = f + ' und ' + s;
			};

			var slide_lr = function(f, s) {
				TextEditor.ih_preset = f + ' und ' + s;
			};

			var search_nostyle = function(t) {
				TextEditor.ih_preset = t.innerHTML + ' (this)';
			};

			var sh_link_editor = function(t) {
				var link_target = (TextEditor.ih_preset != '') ? TextEditor.ih_preset : t.onclick;
				var ih = '<label>Link Text</label><label>Link Ziel</label><br/><input value="' + t.innerHTML + '"/><input value="' + link_target + '"/><i class="fa fa-times-circle" aria-hidden="true" onclick="go_TextEditor()"></i>';
				TextEditor.ih_preset = '';
				come_TextEditor(ih, t, [t.parentNode.offsetLeft, t.parentNode.offsetTop - 132]);
			};

			var go_TextEditor = function(tx, t, p) {
				TextEditor.style.display = 'none';
				TextEditor.innerHTML = '';
				document.getElementById('process_overlay').classList.remove('process_overlay_dark');
			};

			var come_TextEditor = function(tx, t, p) {
				if (TextEditor.style.display != 'block' || TextEditor.origin != t) {
					//TextEditor.style.left = p[0] + 'px';
					TextEditor.innerHTML = tx;
					TextEditor.style.display = 'block';
					TextEditor.style.left = (window.innerWidth - TextEditor.offsetWidth) / 2 + 'px';
					TextEditor.style.top = p[1] + 'px';
					TextEditor.children[4].focus();
					TextEditor.origin = t;
					document.getElementById('process_overlay').classList.add('process_overlay_dark');

				} else {
					go_TextEditor();
				}
			};

			/*******    end textpart editor functions   *******/


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
					//document.getElementById('process_overlay').classList.remove('process_overlay_dark');

				};
				try_img.onload = function() {
					temp_ih += '<img ondrop="drop(event)" ondragover="allowDrop(event)" src="' + try_img.src + '" />';
					var c = this.count;
					c++;
					load_additional_images(c);
				};
				try_img.src = 'images/mobile/' + to_edit_folder + '/' + to_edit.comp_name + '_' + c + '.jpg?zuza' + Math.floor(Math.random() * (1000) + 1);
			};

			var getvals = function() {


				//loadXMLDoc('inhalt.js', function() { // org (inhalt.js)
				loadXMLDoc('inhalt2.js', function() { // get json data on load

					if (xmlhttp.readyState == 4) {
						if (xmlhttp.status == 200) {

							folders = JSON.parse(xmlhttp.responseText).folders;

							var largest = 0;

							for (var i = 0; i < folders.length; i++) {

								document.getElementById('basis').innerHTML += '<th>' + folders[i].menu_name + '<i class="fa fa-plus-circle" aria-hidden="true" onclick="new_entry(this)"></i></th>';

								if (largest < folders[i].data.length) {
									largest = folders[i].data.length;
								}

							}

							var p = -1;
							var cycle = function(c) {
								p++;
								var ih = '';
								for (var i = 0; i < folders.length; i++) {
									ih += (typeof folders[i].data[p] !== 'undefined') ? '<td class="lk" onclick="edit(this)" f="' + i + '" d="' + p + '">' + folders[i].data[p].name + '</td>' : '<td></td>';
								}

								return ih;
							};


							var new_raw = '<tr>';

							for (var j = 0; j < largest; j++) {
								//console.log('cycle ',);
								new_raw += cycle(j) + '</tr><tr>';
							}

							new_raw += '</tr>';

							document.getElementById('basis').parentNode.innerHTML += new_raw;

							document.getElementById('process_overlay').classList.remove('process_overlay_dark');

							TextEditor = document.getElementById('text_editor');


							//page_load();






						} else {
							alert('inhalt shit happens');
						}
					}
				});

				window.addEventListener("scroll", observe_actual_chapter, false);

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

				console.log('swap: ', json);

				swap_image_positions(json);


			}

			var run_swap_multiples = false;
			var swap_multiples = function(o) {

				//remove_image()
				if (o < document.getElementById('Images_display').children.length - 2) {


					swap = [to_edit.comp_name + '_' + o, to_edit.comp_name + '_' + parseInt(o + 1)];

					var json = JSON.stringify({
						"folder": to_edit_folder,
						"one": swap[0],
						"two": swap[1]
					});

					console.log('swap: ', json);

					swap_image_positions(json);

				} else {

					swap = [to_edit.comp_name + '_' + o];

					var json = JSON.stringify({
						"folder": to_edit_folder,
						"one": swap[0]
					});

					console.log('swap: ', json);

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

				//var file = save_image_presets[0];

				var freader = new FileReader();
				freader.onload = function(evt) {

					img.onload = function() {
						encInContext.clearRect(0, 0, encInCanvas.width, encInCanvas.height);
						encInCanvas.width = this.width;
						encInCanvas.height = this.height;
						encInContext.drawImage(img, 0, 0);

						WebPEncodeAndDraw(80);

					};
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

					//var start = new Date();

					//CODE START
					var encoder = new WebPEncoder();

					//Config, you can set all arguments or what you need, nothing no objeect
					var
						config = new Object()
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

					//var end = new Date();
					//var bench_libwebp = (end - start);

					//console.log('Speed result:<br />libwebp: finish in ' + bench_libwebp + 'ms - ' + size + 'bytes<pre>' + encoder.ReturnExtraInfo() + '</pre>');

					base64URI = btoa(out.output);
					//console.log(base64URI);

					/*    prepare json and upload_file   */

					/*    extension   */

					var webp_json = JSON.stringify({
						"folder": 'webp/' + save_image_presets[2], //to_edit_folder,
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

								/*
																clearInterval(uploadtimerId);
								*/




							} else {
								alert('upload_file (webp) shit happens');
							}
						}

					}, webp_json);

					/*    end upload_file   */


				}

			};