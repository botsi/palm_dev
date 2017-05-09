var sivId, fadeinmovId, foimId, speedId;

var wlh, folders, hg;

var disable_cine = true;

var jump_destination = false;

var google_pad_map_url = 'comgooglemaps://?q=Dammweg+41,+3013+Bern';

var google_map_link = 'https://www.google.ch/maps/place/Dammweg+41,+3013+Bern/@46.9586655,7.4438403,17z/data=!3m1!4b1!4m5!3m4!1s0x478e39ecbecd9651:0x3ae88eac744bae78!8m2!3d46.9586655!4d7.446029';



var align_onresize = function() {

	//		imediate

	var cm = document.getElementById('chapter_menu');

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
	r += (c[i].time) ? '<span class="mo_ye"><br/>' + adjustments_de.monthNames[c[i].time.from[1] - 1] + ' ' + c[i].time.from[2] + '</span>' : '';
	r += (c[i].published) ? '<span class="mo_ye"><br/>' + c[i].published.year + '</span>' : '';
	r += (!c[i].time && !c[i].published) ? '<span class="mo_ye"><br/>&nbsp;</span>' : '';

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

	if (typeof c[i].epilog.App !== 'undefined') {
		//alert('app');

		insert = ['<div></div>', '<div class="palma_app"></div>'];

	}

	if (typeof c[i].map !== 'undefined') {

		insert = ['<div></div>', '<div id="palma_map"></div>'];

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


	/*------------------	pushState stuff	------------------*/

	//	if call dosent come from history buttons and project is realy fresh

	if (hist_push == true && history.state != img.slice(0, img.indexOf('_'))) {

		//	disable any position storage

		if ('scrollRestoration' in history) {
			history.scrollRestoration = 'manual';
		}

		//	and make a new history entry

		history.pushState(img.slice(0, img.indexOf('_')), '', '');

	}

	hist_push = true;

	//console.log('history ', history);

	/*------------------	end pushState	------------------*/


	img = img.replace('_0', '');

	var test_imageObj = new Image();

	test_imageObj.onerror = function() {

		change_image('default');

		return;

	};

	test_imageObj.onload = function() {

		fade_img("hg_cover", 'url("' + img_type.path + folders[chapter].name + '/' + img + img_type.ext + '")');

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

		//t.parentNode.parentNode.style.background = 'rgba(191, 191, 191, 0.6)';

		t.parentNode.parentNode.nextSibling.style.visibility = 'hidden';

	} else {

		//	text commes

		disable_cine = true;

		t.style.display = 'none';

		t.previousSibling.style.display = 'inline-block';

		t.parentNode.parentNode.nextSibling.style.visibility = 'visible';

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

	return 0 - el.getBoundingClientRect().top;
};

var white_head = function() {

	var uat = document.getElementsByClassName('ueandtx');

	var h = get_page_scroll_position(uat[0]);

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

		if (typeof folders[chapter].data[i].epilog.App !== 'undefined') {

			app_display_data.act_app = folders[chapter].data[i].comp_name;

			document.getElementsByClassName('palma_app')[i].innerHTML = app_display_data[folders[chapter].data[i].comp_name].apendix();

		}

	}

	var g = getNearestNumber(midpoints, h + window.innerHeight / 2 + 240);

	if (folders[chapter].last_position == g && chapter == old_chapter) {
		//console.log('(disabled) ireturn in middle of white_head');
		//clearTimeout(sivId);
		return;
	}

	old_chapter = chapter;

	folders[chapter].last_position = g;

	cc.style.height = 'auto';

	disable_cine = (folders[chapter].data[folders[chapter].last_position].bilder.length == 0);

	change_image(folders[chapter].data[folders[chapter].last_position].comp_name + '_' + folders[chapter].data[folders[chapter].last_position].slid_count);

	if (typeof folders[chapter].data[g].map !== 'undefined') {

		document.getElementById('palma_map').innerHTML = '<img src="images/gog.png" />';

		document.getElementById('palma_map').addEventListener('click', function() {
			window.location = (window.navigator.userAgent.indexOf("iPad") != -1 || window.navigator.userAgent.indexOf("iPhone") != -1) ? google_pad_map_url : google_map_link;
		});

	}


};

/*

var snap = false;

var snap_in = function(ix) {
	snap = true;
	clearTimeout(sivId);

	sivId = setTimeout(function() {
		document.getElementById('header_txt').innerHTML = 'oki, lastpos: ' + document.getElementsByClassName('scroll_positioner')[ix];
		document.getElementsByClassName('scroll_positioner')[ix].scrollIntoView({
			block: "start",
			behavior: "smooth"
		});
		snap = false;
	}, 5000);

};

*/

var preset_new_bg = function(n) {

	if (hg.set) {

		return;

	}

	hg.set = true;

	var ni = folders[chapter].data[folders[chapter].last_position].slid_count + n / Math.abs(n);

	if (ni > bilder()[folders[chapter].last_position].length || ni == 0) {

		ni = '';

	} else {

		if (ni < 0) {

			ni = '_' + bilder()[folders[chapter].last_position].length;

		} else {

			ni = '_' + ni;

		}

	}

	hg.style.backgroundImage = 'url("' + img_type.path + folders[chapter].name + '/' + folders[chapter].data[folders[chapter].last_position].comp_name + ni + img_type.ext + '")';

};

var fade_img = function(over, ni) {

	var over = document.getElementById(over);

	over.classList.add('change_img_in');

	over.style.backgroundImage = ni;

	setTimeout(function() {

		hg.style.backgroundImage = ni;

		over.classList.remove('change_img_in');

	}, 400);

	hg.set = false;

};


var jump_to = function(j, i) {

	jump_destination = false;

	found.style.display = 'none';

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

			//console.log('ju: ' + ju);

			if (typeof ju === 'undefined') {

				cc.scrollTop = 0;

				var cap_ih = '';

				for (var aus = 0; aus < folders[chapter].data.length; aus++) {

					cap_ih += inhalt(folders[chapter].data, aus);

				}

				cc.innerHTML = cap_ih;

				//cc.style.height = 0;

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
					white_head();

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
			white_head();

		}
	}

};

var search = function(t) {

	jump_destination = false;

	t.style.color = '#fff';
	//t.parentNode.style.border = '2px solid #bc123a';

	t.previousSibling.style.display = t.nextSibling.style.display = 'none';

	//found.classList.remove('found_in_out');

	//found.style.display = 'none';

	var toSearch = t.value.toLowerCase().replace(/ /g, '');

	top_loop: for (var f = 0; f < folders.length; f++) {

		for (var i = 0; i < folders[f].data.length; i++) {

			for (key in folders[f].data[i]) {

				if (folders[f].data[i].search.indexOf(toSearch) != -1) {

					t.style.color = '#bc123a';

					t.previousSibling.style.display = t.nextSibling.style.display = 'inline-block';
					t.nextSibling.style.display = 'inline-block';
					t.nextSibling.ix = i;
					t.nextSibling.fx = f;
					t.nextSibling.onclick = function() {
						jump_to(this.ix, this.fx);
					};

					jump_destination = [i, f];

					break top_loop;

				}
			}
		}

	}
};

var arrow = function(e) {

	if (!e) {

		e = window.event;

	}

	if (jump_destination && e.keyCode == 13) {

		found.children[0].children[1].blur();

		jump_to(jump_destination[0], jump_destination[1]);

		found.style.display = 'none';

	}
};


var start_cine = function() {

	var t = document.getElementById('hg_cover');

	cc.addEventListener('touchstart', function() {
		if (disable_cine == false) {
			get_mouse_coords(t, this);
		}
	}, false);

	cc.addEventListener('touchmove', function() {
		if (disable_cine == false) {
			check_swipe(t);
		}
	}, false);

	cc.addEventListener('touchend', function() {
		if (disable_cine == false) {
			swap_now(t);
		}
	}, false);

};


var get_cine_script = function() {

	var s = document.createElement('script');

	s.setAttribute("type", "text/javascript");

	s.setAttribute("charset", "utf-8");

	s.onload = function() {

		start_cine();

		preload_images.get_arrays('kind', folders, 'name');

	};

	s.src = 'js/cinema.min.js';

	document.getElementsByTagName('head')[0].appendChild(s);

};

var page_load = function() {


	/******************************************************************************************
							definitions
	******************************************************************************************/

	wlh = window.location.href;

	display_prel = document.getElementById('preloaded');

	found = document.getElementById('found');

	cc = document.getElementById('chapter_content');

	hg = document.getElementById('hg');
	hg.set = false;

	/******************************************************************************************
							end definitions
	******************************************************************************************/


	/******************************************************************************************
							remove unused elements (mobile version)
	******************************************************************************************/

	document.body.removeChild(document.getElementsByClassName('fa-angle-left')[0]);
	document.body.removeChild(document.getElementsByClassName('fa-angle-right')[0]);
	document.body.removeChild(document.getElementById('hg_audio'));

	/******************************************************************************************
							end remove unused elements
	******************************************************************************************/


	for (var f = 0; f < folders.length; f++) {

		for (var s = 0; s < folders[f].data.length; s++) {

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

		document.getElementById('content').appendChild(a);

		folders[f].last_position = 0;

	}



	var s = document.createElement('div');

	s.className = 'item_search';

	s.innerHTML = '<i class="fa fa-search" aria-hidden="true"></i>';

	s.addEventListener('click', function() {
		found.children[0].children[1].value = '';
		if (found.style.display == 'block') {
			found.style.display = 'none';
		} else {
			found.style.display = 'block';
			found.children[0].children[1].focus();
		}

	}, false);

	document.getElementById('content').insertBefore(s, document.getElementById('content').children[3]);

	found.innerHTML = '<p><i class="fa fa-check search_check" aria-hidden="true"></i><input type="text" onkeyup="search(this)" placeholder=" ... suchen" /><i class="fa fa-arrow-circle-right" aria-hidden="true"></i></p>';

	//window.addEventListener("resize", align_onresize, false);


	cc.addEventListener("scroll", white_head, false);

	window.addEventListener("keydown", arrow, false);

	window.addEventListener('popstate', function(e) {

		botsi_history(e);

	});

	get_cine_script();

};
