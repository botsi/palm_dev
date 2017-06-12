			var loadXMLDoc = function(url, cfunc, val) {

				xmlhttp = new XMLHttpRequest();

				xmlhttp.onreadystatechange = cfunc;


				xmlhttp.open("POST", url, true);


				xmlhttp.send(val);


			};


			function EventListener(obj, evt, fnc, useCapture) {
				if (!useCapture) useCapture = false;
				if (obj.addEventListener) {
					obj.addEventListener(evt, fnc, useCapture);
					return true;
				} else if (obj.attachEvent) return obj.attachEvent("on" + evt, fnc);
				else {
					MyAttachEvent(obj, evt, fnc);
					obj['on' + evt] = function() {
						MyFireEvent(obj, evt)
					};
				}
			}

			function MyAttachEvent(obj, evt, fnc) {
				if (!obj.myEvents) obj.myEvents = {};
				if (!obj.myEvents[evt]) obj.myEvents[evt] = [];
				var evts = obj.myEvents[evt];
				evts[evts.length] = fnc;
			}

			function MyFireEvent(obj, evt) {
				if (!obj || !obj.myEvents || !obj.myEvents[evt]) return;
				var evts = obj.myEvents[evt];
				for (var i = 0, len = evts.length; i < len; i++) evts[i]();
			}

			////------------------------------------------------------------------------
			////------------------------------------------------------------------------

			function WebPEncDemo() {
				var encInCanvas = document.getElementById("encoderInputCanvas"),
					encInContext = encInCanvas.getContext("2d"),
					img = document.createElement("img"),

					encOutputWebPImage = document.getElementById('encOutputWebPImage'),
					base64URI = '';

				/*
								clearCanvas = function() {
									encInContext.clearRect(0, 0, encInCanvas.width, encInCanvas.height);
								};
								resizeCanvas = function() {
									encInCanvas.width = img.width;
									encInCanvas.height = img.height;
								}
				*/


				EventListener(encInCanvas, "dragenter", function(evt) {
					evt.preventDefault();
					evt.stopPropagation();
				}, false);

				EventListener(encInCanvas, "dragover", function(evt) {
					evt.preventDefault();
					evt.stopPropagation();
				}, false);

				EventListener(encInCanvas, "drop", function(evt) {
					evt.preventDefault();
					evt.stopPropagation();

					var files = evt.dataTransfer.files;
					if (files.length > 0) {
						var file = files[0];
						if (typeof FileReader !== "undefined") {
							if (file.type.indexOf("image") != -1) {
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
								freader.readAsDataURL(file);
							} else {
								alert('Your Browser don\'t support the Filereader API');
							}
						}
					}
				}, false);

				WebPEncodeAndDraw = function(qualityVal) {
					//24bit data (alpha coming soon)
					var input = encInContext.getImageData(0, 0, encInCanvas.width, encInCanvas.height);
					var w = input.width,
						h = input.height;
					var inputData = input.data;
					var out = {
						output: ''
					};
					var start = new Date();

					//CODE START
					var encoder = new WebPEncoder();

					//Config, you can set all arguments or what you need, nothing no objeect
					var
						config = new Object()
					config.target_size = 0; // if non-zero, set the desired target size in bytes. Takes precedence over the 'compression' parameter.
					config.target_PSNR = 0.; // if non-zero, specifies the minimal distortion to	try to achieve. Takes precedence over target_size.
					config.method = 5; // quality/speed trade-off (0=fast, 6=slower-better)    //  was method
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

					var end = new Date();
					var bench_libwebp = (end - start);

					console.log('Speed result:<br />libwebp: finish in ' + bench_libwebp + 'ms - ' + size + 'bytes<pre>' + encoder.ReturnExtraInfo() + '</pre>');

					base64URI = btoa(out.output);
					console.log(base64URI);

					/*    prepare json and upload_file   */

					var webp_json = JSON.stringify({
						"folder": "test", //to_edit_folder,
						"name": "mytest2.webp",
						"base": base64URI
					});


					loadXMLDoc('../../scripts/upload_webp.php', function() { // swap image names (numbers) on server

						if (xmlhttp.readyState == 4) {
							if (xmlhttp.status == 200) {

								console.log('oki, webp test done', xmlhttp.responseText); // output php echo for control


							} else {
								alert('upload_file (webp) shit happens');
							}
						}

					}, webp_json);

					/*    end upload_file   */


				}

			};
