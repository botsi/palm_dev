function sendData(data) {
    var XHR = new XMLHttpRequest();
    var urlEncodedData = "";
    var urlEncodedDataPairs = [];
    var name;

    // Turn the data object into an array of URL-encoded key/value pairs.
    for (name in data) {
        urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }

    // Combine the pairs into a single string and replace all %-encoded spaces to
    // the '+' character; matches the behaviour of browser form submissions.
    urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

    // Define what happens on successful data submission
    XHR.addEventListener('load', function(event) {

        //for (l in event.target.responseText) {
        //ih += folders[i].data[l].name + '<br/><br/><span style="margin-left:24px;">' + folders[i].data[l].search.toString().replace(/,/g, ' / ') + '</span><br/><br/><br/><br/>';
        console.log(event.target.responseText);

        shop.display(true);

        //}


    });

    // Define what happens in case of error
    XHR.addEventListener('error', function(event) {
        alert('Oups! Something goes wrong.');
    });

    // Set up our request
    XHR.open('POST', 'scripts/sendmail.php');

    // Add the required HTTP header for form data POST requests
    XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Finally, send our data.
    XHR.send(urlEncodedData);
}
