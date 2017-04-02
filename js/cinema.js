//		-----------------------------------------------------------------		cinema		-----------------------------------------------------------------


var mouse_x, mouse_y;

var old_img_pos;

var rc_dir = 0;

var randomId, sendoutId;

function get_mouse_coords(t) {

    mouse_x = event.pageX;
    mouse_y = event.pageY;
    old_img_pos = t.offsetLeft - (window.innerWidth - t.offsetWidth) * 0.5 + 20;

    rc_dir = 0;

}

function check_swipe(t) {

    //start.style.display = 'none';

    event.preventDefault();

    var new_mouse_x = event.pageX;
    var new_mouse_y = event.pageY;

    t.style.left = old_img_pos + (new_mouse_x - mouse_x) + 'px';

    if ((new_mouse_x - mouse_x) > 100) {

        rc_dir = -1;

    }

    if ((new_mouse_x - mouse_x) < -100) {

        rc_dir = 1;

    }

    if ((new_mouse_x - mouse_x) <= 100 && (new_mouse_x - mouse_x) > -100) {

        rc_dir = 0;

    }

}



function swap_now(t) {

    var snap_time = 50;

    this.slid_end = function() {

        clearInterval(sendoutId);

        if (rc_dir != 0) {

            //from_arrow = false;

            slide_lr(rc_dir);

        }

        t.style.left = rc_dir * 4 + 'px';
        /*
                clearTimeout(randomId);

                randomId = setTimeout(function() {

                    t.style.left = 20 + 'px';

                }, snap_time);
        */
    };

    if (rc_dir != 0) {

        var pos = parseInt(t.style.left);

        sendoutId = setInterval(function() {

            pos = pos - rc_dir * 10

            t.style.left = pos - rc_dir * 10 + 'px';


            if (t.getBoundingClientRect().left > window.innerWidth + 60 || t.getBoundingClientRect().right < -60) {
                slid_end();
            }

        }, 5);


    } else {

        t.style.left = 0 + 'px';

    }

}





//		-------------------------------------------------------------		fertig  cinema		-------------------------------------------------------------
