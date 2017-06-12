var try_downloadId;
var try_downloadCount = 0;
var api_url = "http://api2.online-convert.com/jobs";
var setHeaders = function(x) {
	x.setRequestHeader("x-oc-api-key", "eb0594df1c0441c1defbf785709aca1c");
	x.setRequestHeader("content-type", "application/json");
	x.setRequestHeader("cache-control", "no-cache");
	return x;
}
var completeWebP = function(jbid) {
	try_downloadCount++;
	if (try_downloadCount > 20) {
		clearInterval(try_downloadId);
		try_downloadCount = 0;
		console.log('tryed for 10 sec, but no image to download');
		return;
	}
	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function() {
		if (this.readyState === 4) {
			var resp = JSON.parse(this.responseText);
			console.log(resp);

			if (resp.status.code == "completed") {
				//document.getElementById('dnld').innerHTML = '<img src="' + resp.output[0].uri + '" />';
				console.log('ok: ', resp.output[0].uri);
				try_downloadCount = 0;
				clearInterval(try_downloadId);

				temp_ih = '<img src="images/mobile/' + to_edit_folder + '/' + to_edit.comp_name + '.jpg" />';
				load_additional_images(1);
				close_image_editor();


			} else {
				console.log('not ok');
			}
		}
	});

	xhr.open("GET", api_url + "/" + jbid);

	xhr = setHeaders(xhr);

	xhr.send();

};

var startWebP = function(img_url) {

	var data = JSON.stringify({
		"input": [{
			"type": "remote",
			"source": img_url,
			"content_type": "image/jpeg"
		}],
		"conversion": [{
			"category": "image",
			"target": "webp"
		}]
	});

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function() {
		if (this.readyState === 4) {
			var obj = JSON.parse(this.responseText);
			try_downloadId = setInterval(function() {
				console.log(obj.id);
				completeWebP(obj.id);
			}, 500);
		}
	});

	xhr.open("POST", api_url);

	xhr = setHeaders(xhr);

	xhr.send(data);

};
