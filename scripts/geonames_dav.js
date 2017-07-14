/*    postalcode and geonames stuff   */


function createCrossDomainRequest(xdr) {
	var request;
	if (xdr) {
		request = new window.XDomainRequest();
	} else {
		request = new XMLHttpRequest();
	}
	return request;
}

function callOtherDomain(url, xdr, el) {
	if (invocation) {
		if (xdr) {
			invocation.onload = outputResult;
			invocation.open("GET", url, true);
			invocation.send();
		} else {
			invocation.open('GET', url, true);

			invocation.onreadystatechange = function() {
				if (invocation.readyState == 4) {
					if (invocation.status == 200) {

						var r = JSON.parse(invocation.responseText);

						if (r.postalCodes.length > 0) {
							if (typeof el === 'function') {
								var a = [r.postalCodes[0].postalCode, r.postalCodes[0].placeName];
								var opt = [r.postalCodes[0].postalCode];
								if (r.postalCodes.length > 1) {
									for (var i = 1; i < r.postalCodes.length; i++) {
										if (r.postalCodes[i].placeName.indexOf(r.postalCodes[0].placeName) != -1 && opt.indexOf(r.postalCodes[i].postalCode) == -1) {
											opt.push(r.postalCodes[i].postalCode);
										}
									}
								}
								a.push(opt);
								el(a);

							} else {
								el.value = r.postalCodes[0].postalCode + ' ' + r.postalCodes[0].placeName;
								if (el.nextSibling && el.nextSibling.tagName.toLowerCase() == 'input') {
									el.nextSibling.value = ''
								}
							}
						} else {
							if (typeof el === 'function') {
								el(["", "", 0]);
							}
						}

					} else {
						alert("inner Invocation Errors Occured");
					}
				}
			};

			invocation.send();
		}
	} else {
		alert("outer Invocation Errors Occured");
	}
}

function get_geonames_array(op, ori, el) {

	var el = (!el) ? ori : el;

	var act_country = 'CH';

	var s = (op == "number") ? "postalcode" : "placename";

	var h = (window.location.href.indexOf("https://") == -1) ? "http://api" : "https://secure";

	var u = h + ".geonames.org/postalCodeSearchJSON?" + s + "=" + encodeURIComponent(ori.value) + "&country=" + act_country + "&username=sagres32";

	var XDR = window.XDomainRequest ? true : false;

	invocation = createCrossDomainRequest(XDR);

	callOtherDomain(u, XDR, el);

}