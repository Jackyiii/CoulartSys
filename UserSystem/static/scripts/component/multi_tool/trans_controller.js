/*******global variables */
let corners_a4 = [0, 0, 0, 500, 800, 0, 800, 500];
var select_corners = [];
var corners = [];
let marker_id = [0, 2, 4, 6];
var index = 0;

/* button handler*/
function startHandler() {
    /** select */
    document.getElementById('container_tranform').addEventListener('click', select, false);

}

/* button handler*/
function finishHandler() {
    /** remove select */
    document.getElementById('container_tranform').removeEventListener('click', select, false);

    /** auto perspective */
    if (select_corners.length == 8) {
        corners = corners_a4;
        transform2d('box_transform', select_corners, corners);

        /** auto update markers */
        for (var i = 0; i < 8; i += 2) {
            var marker = document.getElementById("marker" + i);
            marker.style.left = corners[i] + "px";
            marker.style.top = corners[i + 1] + "px";
            marker.style.visibility = "visible";
            console.log("============marker: " + i + "==" + marker.style.left + "==== " + marker.style.top);
        }
    }
}


/** select function */
function select(event) {
    //get position
    var box = event.target.getBoundingClientRect();
    var x = event.clientX - box.left; // == event.offsetX
    var y = event.clientY - box.top; // event.offsetY
    //info.innerHTML = 'Position X : ' + event.clientX + '<br />Position Y : ' + event.clientY;

    info.innerHTML = 'X : ' + x + '<br />Y : ' + y;
    if (select_corners.length < 8) {

        var marker = document.getElementById("marker" + marker_id[index]);
        marker.style.left = x + "px";
        marker.style.top = y + "px";
        marker.style.visibility = "visible";

        select_corners.push(x);
        select_corners.push(y);
        index += 1;

    }
}

/* button handler*/
function correctHandler() {

    /** disable browser automate drag&drop function */
    /** disable image drag&drop */
    /** important ! */
    var img = document.getElementById('img');
    img.ondragstart = function() {
        return false;
    };

    var marker6 = document.getElementById('marker6');
    marker6.ondragstart = function() {
        return false;
    }

    var markerId = 'undefined';

    window.addEventListener('mouseup', function() {
        console.log("============mouse up");
        if (markerId != 'undefined') {
            markerId = 'undefined';
        }
    });


    /******** mousedown, select marker *********/
    window.addEventListener('mousedown', function(event) {
        if ((markerId == 'undefined') && (event.target.id != null)) {
            var id = event.target.id;
            markerId = id;
        }
    });

    /**mousemove, update */
    window.addEventListener('mousemove', function(event) {

        if ((markerId != 'undefined') && (markerId != null) && (event.pageX != 'undefined')) {
            var i = parseInt(markerId.charAt(markerId.length - 1));

            /** update corner */
            //let shiftX = event.clientX - ball.getBoundingClientRect().left;
            //let shiftY = event.clientY - ball.getBoundingClientRect().top;

            // TODO: get center
            corners[i] = event.pageX - 10;
            corners[i + 1] = event.pageY - 10;

            /** update corner marker */
            var marker = document.getElementById(markerId);
            marker.style.left = corners[i] + "px";
            marker.style.top = corners[i + 1] + "px";

            /** update perspective transform */
            transform2d('box_transform', select_corners, corners);
        }
    });


}



/* button handler*/
function resetHandler() {
    /** reset transform */
    var box = document.getElementById('box_transform');
    box.style["-webkit-transform"] = 'initial';
    box.style["-moz-transform"] = 'initial';
    box.style["-o-transform"] = 'initial';
    box.style.transform = 'initial';

    /** reset select_corners */
    select_corners = [];

    /** reset markers */
    index = 0;

    /** reset container */
    var marker = document.getElementById('marker0');
    marker.style["visibility"] = 'hidden';
    var marker = document.getElementById('marker2');
    marker.style["visibility"] = 'hidden';
    var marker = document.getElementById('marker4');
    marker.style["visibility"] = 'hidden';
    var marker = document.getElementById('marker6');
    marker.style["visibility"] = 'hidden';


}

/** function perspective transform */
// src: source corners
// des: destination corners
function transform2d(elt, src, des) {
    var elt = document.getElementById(elt);
    var transform = PerspT(src, des);
    var t = transform.coeffs;
    t = [t[0], t[3], 0, t[6],
        t[1], t[4], 0, t[7],
        0, 0, 1, 0,
        t[2], t[5], 0, t[8]
    ];
    t = "matrix3d(" + t.join(", ") + ")";

    elt.style["-webkit-transform"] = t;
    elt.style["-moz-transform"] = t;
    elt.style["-o-transform"] = t;
    elt.style.transform = t;
}


// window.addEventListener('load', function() {
//   document.documentElement.style.margin="0px";
//   document.documentElement.style.padding="0px";
//   document.body.style.margin="0px";
//   document.body.style.padding="0px";
//   update();
// });



window.onload = function() {
    var btn1 = document.getElementById("btn1");
    btn1.onclick = function() {
        startHandler();
    }
    document.addEventListener('mousemove', (event) => {
        //console.log(`Mouse X: ${event.clientX}, Mouse Y: ${event.clientY}`);
        //info.innerHTML = 'Position X : ' + event.pageX + '<br />Position Y : ' + event.pageY;
        info.innerHTML = 'Position X : ' + event.clientX + '<br />Position Y : ' + event.clientY + '<br /> Conners: ' + corners + '<br /> Length:' + corners.length;
        console.log(corners);
    });

    //document.getElementById('rect').addEventListener('click', printPosition);

}