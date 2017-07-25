var link_editor_io = {
	"ih_preset": "",
	"link_kind": "virgin",
	"origin": "",
	"prepare": function(t) {

		/******   clear TextEditor ih_preset   ******/

		/******   end clear   ******/

		var ih = '<label>Link Text:</label><input value="' + this.origin.innerHTML;

		if (this.origin.tagName.toLowerCase() == 'a' && this.origin.onclick == null) {
			ih = '<label>Link Text:</label><input value="' + this.origin.innerHTML;
			this.ih_preset = this.origin.href;
			console.log(this.ih_preset);
		}
		if (this.origin.tagName.toLowerCase() == 'input') {
			ih = '<label>Link Text:</label><input value="' + this.origin.value;
			if (this.origin.getAttribute("store_link")) {
				this.ih_preset = this.origin.getAttribute("store_link");
			} else {
				this.ih_preset = 'http://';
			}
			console.log(this.origin.getAttribute("store_link"));
			console.log(this.ih_preset);
		}
		if (this.origin.tagName.toLowerCase() == 'i') {
			ih = '<label>Link Text:</label><input value="' + this.origin.getAttribute('to_link_text');
			this.link_kind = 'virgin';
			this.ih_preset = 'http://';
			console.log(this.ih_preset);
		}



		switch (this.link_kind) {
			case 'virgin':
				var link_target = this.link_kind;
				var secondfield = '<input value="' + link_target + '" onkeyup="validate_link_target()"/>';
				break;
			case 'slide_lr':
				var link_target = this.link_kind + this.ih_preset;
				var secondfield = make_secondfield(link_target);
				break;
			case 'search_nostyle':
				var link_target = this.link_kind + this.ih_preset;
				var secondfield = make_secondfield(link_target);
				break;
			case 'jump_to':
				var link_target = this.link_kind + this.ih_preset;
				break;
			case '':
				var link_target = this.origin.onclick.toString().slice(this.origin.onclick.toString().indexOf('slide_lr') + 9, this.origin.onclick.toString().length - 3);
				alert('no link_kind defined');
				return;
				break;
			default:
				alert('no link_kind defined');
				return;
		}

		console.log('this: ', this);
		console.log('link_target: ', link_target);

		//return;




		/*
				var link_target = (TextEditor.ih_preset != '') ? TextEditor.ih_preset : t.onclick.toString().slice(t.onclick.toString().indexOf('slide_lr') + 9, t.onclick.toString().length - 3);
				link_target = (TextEditor.ih_preset.indexOf('slide_lr') == -1) ? link_target : TextEditor.ih_preset.replace('slide_lr', '');
				link_target = (TextEditor.ih_preset.indexOf('search_nostyle') == -1) ? link_target : TextEditor.ih_preset.replace('search_nostyle', '');

				if ((TextEditor.ih_preset.indexOf('slide_lr') == -1) && (TextEditor.ih_preset.indexOf('search_nostyle') == -1)) {
				} else {
					var secondfield = make_secondfield(link_target);

				}
				console.log('link_target: ', link_target);
				console.log('TextEditor.ih_preset: ', TextEditor.ih_preset);

		*/

		ih += '" onkeyup="validate_link_ih(this)"/><br/><label>Link Ziel:</label>' + secondfield + '<i title="Link entfernen aber Text belassen." class="fa fa-minus-circle" style="position: absolute;left: 22%;" aria-hidden="true" onclick="remove_link()"></i><i class="fa fa-times-circle" aria-hidden="true" onclick="go_TextEditor()"></i>';
		if (this.link_kind == 'virgin') {

			ih += '<div class="link_btn_raw">';
			if (this.origin.tagName.toLowerCase() != 'input') {
				ih += '<button type="button" class="link_kind_btn" onclick="link_kind_response(this,1)"><i class="fa fa-picture-o" aria-hidden="true"></i> Bild</button>';
			}
			ih += '<button type="button" class="link_kind_btn" onclick="link_kind_response(this,2)"><i class="fa fa-file-text-o" aria-hidden="true"></i> Projekt</button>';
			ih += '<button type="button" class="link_kind_btn" onclick="link_kind_response(this,4)"><i class="fa fa-external-link" aria-hidden="true"></i> Webseite</button>';
			ih += '</div>';
		}
		ih += '<button type="button" class="ok_link_btn" id="confirm_link" onclick="ok_link(this)"><i class="fa fa-check" aria-hidden="true"></i>Ok, übernehmen</button>';
		come_TextEditor(ih, this.origin);

	},
	"come": function() {},
	"go": function() {}
};

var make_secondfield = function(lt) {
	var s = '<select onchange="validate_link_target()">';

	var o = '';

	if (link_editor.link_kind == 'slide_lr') {

		for (var i = 1; i < document.getElementById('Images_display').children.length - 1; i++) {

			o += (i != lt) ? '<option value="' + i + '">Bild ' + i + '</option>' : '<option selected value="' + i + '">Bild ' + i + '</option>';

		}

	} else {

		s = '<select onchange="duplicate_to_linktext(this)">';

		var c = document.getElementsByClassName('lk');

		for (var i = 0; i < c.length; i++) {
			if (c[i].innerText != to_edit.name) {
				o += (c[i].innerText != lt) ? '<option value="' + c[i].innerText + '">' + c[i].innerText + '</option>' : '<option selected value="' + c[i].innerText + '">' + c[i].innerText + '</option>';
			}

		}

	}

	s += o;
	s += '</select>';


	return s;
};