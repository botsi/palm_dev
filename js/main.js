var text_load = function() {

    loadXMLDoc('inhalt.js', function() {

        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {

                folders = JSON.parse(xmlhttp.responseText).folders;

                device_dimensions();

            } else {
                alert('inhalt shit happens');
            }
        }
    });

};


document.addEventListener('DOMContentLoaded', text_load, false);

/*
window.onpopstate = function(event) {
    console.log(history.state);
};
*/
