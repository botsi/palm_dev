//		-----------------------------------------------------------------		cinema		-----------------------------------------------------------------

var mouse_x, mouse_y,

    dist,
    threshold = 60; //required min distance traveled to be considered swipe

var old_img_pos;

var rc_dir = 0;

var randomId, sendoutId;

function get_mouse_coords(t) {

    var touchobj = event.changedTouches[0];
    dist = 0;

    mouse_x = touchobj.pageX;
    mouse_y = touchobj.pageY;
    old_img_pos = t.offsetLeft - (window.innerWidth - t.offsetWidth) * 0.5;

    rc_dir = 0;

}

function check_swipe(t) {

    if (event.touches.length > 1) {
        event.preventDefault();
        return false;
    }

    var touchobj = event.changedTouches[0];
    dist = Math.abs(touchobj.pageX - mouse_x);

    if (dist >= threshold && Math.abs(touchobj.pageY - mouse_y) <= 100) {

        event.preventDefault();


        var new_mouse_x = touchobj.pageX;
        var new_mouse_y = touchobj.pageY;

        preset_new_bg(mouse_x - new_mouse_x);

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

}

function swap_now(t) {

    this.slid_end = function() {

        clearInterval(sendoutId);

        if (rc_dir != 0) {


            slide_lr(rc_dir);

        }

        t.style.left = 0 + 'px';

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

//		-------------------------------------------------------------		end  cinema		-------------------------------------------------------------
