			var folders, to_edit, to_edit_folder, to_edit_image, swap, save_image_presets, TextEditor, all_search;

			var largest = 0;

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

			//			var input_attributes = ' type="text" onkeyup="validate(this,this.parentNode.nextSibling)"';


			var validate = function(t, b) {
				var value = (t.tagName.toLowerCase() == 'input') ? t.value : t.innerHTML;
				console.log(value, 'i validate');
				t.style.background = '#fff';
				t.removeAttribute('title');
				t.style.textDecoration = 'none';


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

				if (entry_kind == 'search') {
					//console.log('index is: ' + all_search.indexOf(value + ',' + to_edit.name));
					console.log(to_edit.name);
					console.log(all_search);
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

				b.classList.add('button_valid');
				b.nextSibling.classList.add('button_valid');

			};


			/******           remove Ausstellungsort           ******/

			var remove_Ausstellungsort = function(t) {

				t.parentNode.nextSibling.classList.add('button_valid');
				t.parentNode.nextSibling.nextSibling.classList.add('button_valid');

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

				t.parentNode.nextSibling.classList.add('button_valid');
				t.parentNode.nextSibling.nextSibling.classList.add('button_valid');

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
					t.parentNode.nextSibling.classList.add('button_valid');
					t.parentNode.nextSibling.nextSibling.classList.add('button_valid');
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

				newItem = document.createElement("i");

				newItem.className = "fa fa-minus-circle";

				newItem.setAttribute("aria-hidden", "true");

				newItem.setAttribute("onclick", "remove_search_item(this)");

				document.getElementById('search_display').insertBefore(newItem, t);

			};




			/******           remove entry           ******/

			var remove_entry = function(t) {
				alert('remove_entry: ');
			};


			/******           new entry           ******/

			var new_entry = function(t) {
				alert('new_entry: ');
			};


			/******           revert           ******/

			var revert = function(t) {

				var entry_kind = t.previousSibling.previousSibling.id.replace('_display', '');


				console.log(to_edit[entry_kind]);

				fill_cat(entry_kind);


				t.classList.remove('button_valid');
				t.previousSibling.classList.remove('button_valid');

			};


			/******           replace entry           ******/

			var save_existing = function(t) {

				t.classList.remove('button_valid');
				t.nextSibling.classList.remove('button_valid');

				/******           overlay (disable other precess)           ******/
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

						temp_ih = '<span>das erste Stichwort wird aus dem Namen / Titel generiert</span><span>fügen Sie bisher auf der Seite nicht vorkommende, passende Stichworte hinzu ...</span><br/>';

						//		add comp_name

						temp_ih += '<input' + input_attributes + ' value="' + to_edit.comp_name + '" />';

						if (to_edit.name.toLowerCase().replace(/ /g, '') != to_edit.comp_name) {

							//		add name

							temp_ih += '<input' + input_attributes + ' value="' + to_edit.name.toLowerCase().replace(/ /g, '') + '" />';

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

						if (typeof to_edit.time !== 'undefined') {
							temp_ih = '<input' + input_attributes + ' value="' + to_edit.time.from[0] + '" />' + '<input' + input_attributes + ' value="' + to_edit.time.from[1] + '" />' + '<input' + input_attributes + ' value="' +
								to_edit.time.from[2] + '" />';
							if (typeof to_edit.time.till !== 'undefined') {
								temp_ih += ' bis ' + '<input' + input_attributes + ' value="' + to_edit.time.till[0] + '" />' + '<input' + input_attributes + ' value="' + to_edit.time.till[1] + '" />' + '<input' + input_attributes +
									' value="' + to_edit.time.till[2] +
									'" />';
							}
						}

						el.innerHTML = temp_ih;

						break;

						/******           epilog data           ******/

					case 'Ausstellungsort':
						temp_ih = '<span>von / bis (wenn mehrere Daten)</span><span>Veranstaltungsort</span><span>Strasse und Hausnummer</span><span>Postleitzahl und Ort</span><span>Land (wenn nicht Schweiz)</span><span>Webseite</span><span>GoogleMaps kurz-url</span>';
						if (to_edit.epilog && to_edit.epilog.Ausstellungsort && Array.isArray(to_edit.epilog.Ausstellungsort)) {
							for (var j = 0; j < to_edit.epilog.Ausstellungsort.length; j++) {
								temp_ih += '<input' + input_attributes + ' datakind="0" value="' + to_edit.epilog.Ausstellungsort[j][0] + '" />' + '<input' + input_attributes + ' datakind="1" value="' + to_edit.epilog.Ausstellungsort[j][1] +
									'" />' +
									'<input' + input_attributes + ' datakind="2" value="' + to_edit.epilog.Ausstellungsort[j][2] + '" />' + '<input' + input_attributes + ' datakind="3" value="' + to_edit.epilog.Ausstellungsort[j][3] + '" />' + '<input' + input_attributes + ' datakind="4" value="' + to_edit.epilog.Ausstellungsort[j][4] + '" />' +
									'<input' + input_attributes + ' datakind="5" value="' + to_edit.epilog.Ausstellungsort[j][5] + '" />' + '<input' + input_attributes + ' datakind="6" value="' + to_edit.epilog.Ausstellungsort[j][6] + '" />';

								temp_ih += (to_edit.epilog.Ausstellungsort.length > 1) ? '<i class="fa fa-minus-circle" aria-hidden="true" onclick="remove_Ausstellungsort(this)"></i><br/>' : '<br/>';

							}


						} else {

							if (to_edit.epilog && to_edit.epilog.Projektort && Array.isArray(to_edit.epilog.Projektort)) {
								for (var j = 0; j < to_edit.epilog.Projektort.length; j++) {
									temp_ih += '<input' + input_attributes + ' datakind="0" value="' + to_edit.epilog.Projektort[j][0] + '" />' + '<input' + input_attributes + ' datakind="1" value="' + to_edit.epilog.Projektort[j][1] + '" />' +
										'<input' + input_attributes + ' datakind="2" value="' + to_edit.epilog.Projektort[j][2] + '" />' + '<input' + input_attributes + ' datakind="3" value="' + to_edit.epilog.Projektort[j][3] + '" />' + '<input' + input_attributes + ' datakind="4" value="' + to_edit.epilog.Projektort[j][4] + '" />' + '<input' +
										input_attributes + ' datakind="5" value="' + to_edit.epilog.Projektort[j][5] + '" />' + '<input' + input_attributes + ' datakind="6" value="' + to_edit.epilog.Projektort[j][6] + '" />';

									temp_ih += (to_edit.epilog.Projektort.length > 1) ? '<i class="fa fa-minus-circle" aria-hidden="true" onclick="remove_Ausstellungsort(this)"></i><br/>' : '<br/>';

								}
							}
						}

						temp_ih += '<i class="fa fa-plus-circle add-raw" aria-hidden="true" onclick="add_Ausstellungsort(this)"></i>';

						el.innerHTML = temp_ih;

						break;

					case 'Impressum':

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

						/*					case '':
												break;
						*/

						/*					case '':
												break;
						*/
					default:

						alert('no default fill_cat defined');

				}

				temp_ih = '';

				el.nextSibling.classList.remove('button_valid');
				el.nextSibling.nextSibling.classList.remove('button_valid');

			};




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

				fill_cat('time');

				/******           epilog data           ******/

				/******           Ausstellungsort           ******/


				document.getElementById('Ausstellungsort_display').innerHTML = '';

				if (to_edit.epilog && (to_edit.epilog.Ausstellungsort || to_edit.epilog.Projektort)) {

					fill_cat('Ausstellungsort');

					document.getElementById('Ausstellungsort_display').parentNode.style.display = 'block';

				} else {

					document.getElementById('Ausstellungsort_display').parentNode.style.display = 'none';

				}

				/******           Impressum           ******/

				document.getElementById('Impressum_display').innerHTML = '';

				if (to_edit.epilog && to_edit.epilog.Impressum) {

					fill_cat('Impressum');

					document.getElementById('Impressum_display').parentNode.style.display = 'block';

				} else {

					document.getElementById('Impressum_display').parentNode.style.display = 'none';

				}

				/******           Ausstellungskonzept           ******/

				document.getElementById('Ausstellungskonzept_display').innerHTML = '';

				if (to_edit.epilog && to_edit.epilog.Ausstellungskonzept) {

					fill_cat('Ausstellungskonzept');

					document.getElementById('Ausstellungskonzept_display').parentNode.style.display = 'block';

				} else {

					document.getElementById('Ausstellungskonzept_display').parentNode.style.display = 'none';

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

			/*******    inputfield editor functions   *******/

			var add_inputfield_editor_funcs = function(el) {

				console.log(el.id);

				//if (el.id == 'Ausstellungskonzept_display') {
				console.log('a s length: ', el.querySelectorAll('a').length);

				var as = el.querySelectorAll('input');

				var newItem;

				for (var i = 0; i < as.length; i++) {

					if (as[i].className != 'keyfield') {

						if (as[i].value.indexOf('http://') != -1 || as[i].value.indexOf('https://') != -1) {


							newItem = document.createElement("div");

							newItem.innerHTML = as[i].value;

							as[i].setAttribute("store_link", newItem.children[0].href);

							as[i].value = newItem.children[0].innerHTML;

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


				if (t.tagName.toLowerCase() == 'input') {
					TextEditor.ih_preset = t.getAttribute("store_link");
					console.log(TextEditor.ih_preset);
				}

				console.log(t.value);
				var link_target = (TextEditor.ih_preset != '') ? TextEditor.ih_preset : t.onclick;
				var ih = '<label>Link Text</label><label>Link Ziel</label><br/><input value="'
				ih += (t.tagName.toLowerCase() == 'input') ? t.value : t.innerHTML;
				ih += '"/><input value="' + link_target + '"/><i class="fa fa-times-circle" aria-hidden="true" onclick="go_TextEditor()"></i>';
				TextEditor.ih_preset = '';
				come_TextEditor(ih, t, [t.parentNode.offsetLeft, t.parentNode.offsetTop]);
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

			var make_all_search = function(p) {

				for (var i = 0; i < folders.length; i++) {
					if (folders[i].data[p] && folders[i].data[p].search) {
						for (var y = 0; y < folders[i].data[p].search.length; y++) {
							all_search.term.push(folders[i].data[p].search[y]);
							all_search.position.push(folders[i].data[p].name);
						}
					}
				}

			};

			var getvals = function() {


				//loadXMLDoc('inhalt.js', function() { // org (inhalt.js)
				loadXMLDoc('inhalt2.js', function() { // get json data on load

					if (xmlhttp.readyState == 4) {
						if (xmlhttp.status == 200) {

							folders = JSON.parse(xmlhttp.responseText).folders;

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


							all_search = {
								"term": [],
								"position": []
							};


							for (var j = 0; j < largest; j++) {
								//console.log('cycle ',);
								new_raw += cycle(j) + '</tr><tr>';
								make_all_search(j);
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