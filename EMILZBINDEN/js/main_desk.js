var index_in_parent = function(child) {
	var i = 0;
	while ((child = child.previousSibling) != null) {
		i++;
	}
	return i;
};

var $divs = document.getElementsByClassName('content-item');

var illuminate = function() {

	var grep = (function() {
		var filtered;
		var swap_position = (window.location.href.indexOf('index') == -1) ? 110 : 110;
		for (var i = 0; i < $divs.length; i++) {
			var elTop = 64 - ($divs[i].getBoundingClientRect().top - swap_position);
			if (elTop < $divs[i].offsetHeight) {
				filtered = i;
				break;
			}
		}
		return filtered;
	})();

	document.getElementsByClassName('header-year')[0].innerHTML = $divs[grep].getAttribute('year', 0);


};

var toggle_img_view = function(t) {

	if (t.parentNode.classList.contains('height_image')) {

		t.parentNode.classList.remove('height_image');

		t.parentNode.nextElementSibling.classList.add('hide_text');

		t.parentNode.nextElementSibling.nextElementSibling.classList.add('hide_text');

	} else {

		t.parentNode.nextElementSibling.classList.remove('hide_text');
		t.parentNode.nextElementSibling.nextElementSibling.classList.remove('hide_text');
		t.parentNode.classList.add('height_image');
	}

};

var outer_link = function(site) {
	window.open(site, '_blank');

};

var inner_link = function(site, position) {
	window.location = site.toLowerCase() + '.html';
};

var page_load = function() {

	colorize();

	query_iframe();

};

var mss = document.getElementById('mss');

var red = true;

var colorize = function() {

	if (red && mss.href !== 'css/botsi_beige.css') {

		mss.onload = function() {

			colorize;

		};

		mss.href = 'css/botsi_beige.css';

	}

};

var gog_query_place = function(t) {
	console.log(t.previousSibling.nodeValue);
	outer_link('https://www.google.ch/maps/?hl=de&q=' + t.previousSibling.nodeValue);
};

var query_iframe = function() {

	var dia = document.getElementById('dia');

	if (dia != null) {
		dia.addEventListener('load', function() {
			if (dia.contentWindow.location.href.indexOf('empty') == -1) {
				dia.style.display = 'block';
				console.log(dia.offsetTop, ' dia top');
				//window.scrollTo(0, dia.offsetTop);
			} else {
				dia.style.display = 'none';
				images_arr = [];
				images_arr_tx = [];

			}
		}, false);
	} else {
		console.log('no dia');
	}
};

var images_arr = [];
var images_arr_tx = [];
var dia_position = 0;

var make_img_arr = function(t, d) {

	var as = (t.parentNode.tagName.toLowerCase() != 'p') ? t.parentNode.getElementsByTagName('a') : t.parentNode.parentNode.getElementsByTagName('a');

	if (d == 0 && i != 0) {

		images_arr_tx = [t.getAttribute('displaytext', 0)];

		images_arr = [t.href.split("=")[1].slice(0, t.href.split("=")[1].length - 5)];

		dia_position = 0;

	} else {

		for (var i = 0; i < as.length; i++) {
			var itx = as[i].getAttribute('displaytext', 0);

			images_arr_tx.push(itx);

			images_arr.push(as[i].href.split("=")[1].slice(0, as[i].href.split("=")[1].length - 5));

			if (t == as[i]) {
				dia_position = i;
			}
		}

	}

};


window.addEventListener('scroll', illuminate, false);

window.addEventListener('load', page_load, false);