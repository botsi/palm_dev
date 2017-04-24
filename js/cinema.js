//		-----------------------------------------------------------------		cinema		-----------------------------------------------------------------


var mouse_x, mouse_y;

var old_img_pos;

var rc_dir = 0;

var randomId, sendoutId;

function get_mouse_coords(t) {

    mouse_x = event.pageX;
    mouse_y = event.pageY;
    old_img_pos = t.offsetLeft - (window.innerWidth - t.offsetWidth) * 0.5;

    rc_dir = 0;

}

function check_swipe(t) {



    var new_mouse_x = event.pageX;
    var new_mouse_y = event.pageY;

    //    t.style.left = 0 + 'px';
    t.style.left = old_img_pos + (new_mouse_x - mouse_x) + 'px';


    if ((new_mouse_x - mouse_x) > 100) {

        rc_dir = -1;

        //event.preventDefault();

    }

    if ((new_mouse_x - mouse_x) < -100) {

        rc_dir = 1;

        //event.preventDefault();


    }

    if ((new_mouse_x - mouse_x) <= 100 && (new_mouse_x - mouse_x) > -100) {

        rc_dir = 0;

        //return true;


    }

}



function swap_now(t) {

    this.slid_end = function() {

        clearInterval(sendoutId);

        if (rc_dir != 0) {


            slide_lr(rc_dir);

        }

        t.style.left = 0 + 'px';

        //return true;


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

        //return true;


    }

}

//		-------------------------------------------------------------		end  cinema		-------------------------------------------------------------
