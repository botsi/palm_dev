var disable_swap = false;


var float_img_l = document.getElementsByClassName('body_float')[0];
var float_img_r = document.getElementsByClassName('body_float')[1];

var $divs = document.getElementsByClassName('content-item');
//var last_offset = $divs[0].getBoundingClientRect().top;

var illuminate = function() {

	//var el = document.getElementsByClassName('content-item')[0];

	//console.log(el.getAttribute('year', 0));
	/*
		var dir = (last_offset > $divs[0].getBoundingClientRect().top) ? true : false;
		console.log(dir);
		last_offset = $divs[0].getBoundingClientRect().top;
	*/
	/*

	var grep = (function() {
		var top;
		var top_found = false;
		var middle;
		for (var i = 0; i < $divs.length; i++) {
			//console.log(elTop);
			var elTop = 264 - $divs[i].getBoundingClientRect().top;
			//var elTop = $divs[i].getBoundingClientRect().top;

			if (elTop < $divs[i].offsetHeight && top_found == false) {
				top = i;
				top_found = true;
				//break;
			}

			if (elTop < $divs[i].offsetHeight + 200) {
				middle = i;
				break;
			}

		}

		return [top, middle];
	})();

	*/

	var grep = (function() {
		var filtered;
		var swap_position = (window.location.href.indexOf('index') == -1) ? 160 : 110;
		for (var i = 0; i < $divs.length; i++) {
			var elTop = 64 - ($divs[i].getBoundingClientRect().top - swap_position);
			if (elTop < $divs[i].offsetHeight) {
				filtered = i;
				break;
			}
		}
		return filtered;
	})();


	//console.log(grep);
	//return;
	//if ($divs[grep[0]]) {
	document.getElementsByClassName('header-year')[0].innerHTML = $divs[grep].getAttribute('year', 0);
	//}

	if (window.location.href.indexOf('ausstellungen.html') == -1) {
		return;
	}

	var middle = (function() {
		var filtered;
		for (var i = 0; i < $divs.length; i++) {
			var elTop = $divs[i].getBoundingClientRect().top;
			if (elTop < (window.innerHeight + $divs[i].offsetHeight) / 2 && elTop > (window.innerHeight - $divs[i].offsetHeight) / 2) {
				filtered = i;
				break;
			}
		}
		return filtered;
	})();

	if ($divs[middle]) {

		var side_imgs = $divs[middle].getAttribute('thumb', 0);

		if (disable_swap) {
			return;
		}

		if (float_img_l.src.indexOf('/' + side_imgs + '_l.jpg') == -1) {

			//console.log('actsrc: ' + float_img_l.src);
			console.log('newsrc: ' + 'images/side_img/' + side_imgs + '_l.jpg');

			disable_swap = true;

			float_img_l.classList.remove('fadein_float');
			float_img_r.classList.remove('fadein_float');

			float_img_l.classList.add('fadeout_float');
			float_img_r.classList.add('fadeout_float');

			setTimeout(function() {

				float_img_l.onload = function() {
					this.classList.remove('fadeout_float');
					this.classList.add('fadein_float');
				};

				float_img_l.src = 'images/side_img/' + side_imgs + '_l.jpg';

				float_img_r.onload = function() {
					this.classList.remove('fadeout_float');
					this.classList.add('fadein_float');
				};

				float_img_r.src = 'images/side_img/' + side_imgs + '_r.jpg';

				disable_swap = false;

			}, 300);

		}

	} else {
		console.log('outsrc');
		if (float_img_l.classList.contains('fadein_float')) {

			float_img_l.classList.remove('fadein_float');
			float_img_r.classList.remove('fadein_float');

			float_img_l.classList.add('fadeout_float');
			float_img_r.classList.add('fadeout_float');

		}

	}

	//}

	/*
	//		dump


			<div class="preloaded_ini">
				<img src="images/side_img/albigna_l.jpg" />
				<img src="images/side_img/albigna_r.jpg" />
				<img src="images/side_img/emmental_l.jpg" />
				<img src="images/side_img/emmental_r.jpg" />
				<img src="images/side_img/schwaar_l.jpg" />
				<img src="images/side_img/schwaar_r.jpg" />
				<img src="images/side_img/susten_l.jpg" />
				<img src="images/side_img/susten_r.jpg" />
			</div>

	*/

	/*
		var fromTop = window.pageYOffset;
		var nc = "rgb(" +
			parseInt(fromTop / 5, 10) + ',' +
			parseInt(fromTop / 2, 10) + ',' +
			parseInt(fromTop / 3, 10) + ")";


		document.getElementsByClassName('header-logo')[0].style.background = document.getElementsByClassName('footer')[0].style.background = 'linear-gradient(to right, ' + nc + ', #363539 calc(50% - 480px), #363539 calc(50% + 480px), ' + nc + ')';
	*/

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

var inner_link = function(site,position) {
	        window.location = site.toLowerCase() + '.html';
};

//window.addEventListener('scroll', illuminate, false);
