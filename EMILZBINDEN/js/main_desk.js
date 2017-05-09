var disable_swap = false;


var float_img_l = document.getElementsByClassName('body_float')[0];
var float_img_r = document.getElementsByClassName('body_float')[1];


var illuminate = function() {

	var el = document.getElementsByClassName('content-item')[0];

	//console.log(el.getAttribute('year', 0));



	var $divs = document.getElementsByClassName('content-item');


	var grep = function() {
		var filtered;
		for (var i = 0; i < $divs.length; i++) {
			//console.log(elTop);
			var elTop = 64 - ($divs[i].getBoundingClientRect().top - 200);
			//var elTop = $divs[i].getBoundingClientRect().top;
			if (elTop < $divs[i].offsetHeight) {
				filtered = i;
				break;
			}
		}

		return filtered;
	};








	var uat = Array.prototype.slice.call($divs);

	document.getElementsByClassName('header-year')[0].innerHTML = $divs[grep()].getAttribute('year', 0);

	/*

		uat.forEach(function(item, i) {
			item.classList.remove('active');

		});

		if ($divs[grep() + 1]) {
			$divs[grep() + 1].classList.add('active');
		}

	*/

	if ($divs[grep() + 1]) {

		var side_imgs = $divs[grep() + 1].getAttribute('thumb', 0);

		if (side_imgs != null) {

			if (disable_swap == false && float_img_l.src.indexOf('/' + side_imgs + '_l.jpg') == -1) {

				console.log('ido');
				console.log('actsrc: ' + float_img_l.src);
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

					float_img_r.onload = function() {
						this.classList.remove('fadeout_float');
						this.classList.add('fadein_float');
					};

					float_img_l.src = 'images/side_img/' + side_imgs + '_l.jpg';
					float_img_r.src = 'images/side_img/' + side_imgs + '_r.jpg';

					disable_swap = false;

				}, 300);

			}

		} else {
			if (float_img_l.classList.contains('fadein_float')) {

				float_img_l.classList.remove('fadein_float');
				float_img_r.classList.remove('fadein_float');

				float_img_l.classList.add('fadeout_float');
				float_img_r.classList.add('fadeout_float');

			}

		}

	}

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

window.addEventListener('scroll', illuminate, false);
