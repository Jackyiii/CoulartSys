window.onload = function() {
    document.getElementById("range_angle").addEventListener("input", function(event) {
        setViewAngle(event.target.value);
    });
    document.getElementById("range_angle").addEventListener("change", function(event) {
        setViewAngle(event.target.value);
    });
    document.getElementById("range_scale").addEventListener("input", function(event) {
        setViewScale(event.target.value);
    });
    document.getElementById("range_scale").addEventListener("change", function(event) {
        setViewScale(event.target.value);
    });
    document.getElementById("range_position").addEventListener("input", function(event) {
        setViewPosition(event.target.value);
    });
    document.getElementById("range_position").addEventListener("change", function(event) {
        setViewPosition(event.target.value);
    });
}

function getMedia() {
    let constraints = {
        video: { width: 1080, height: 500 },
        audio: true
    };
    let video = document.getElementById("video");
    let promise = navigator.mediaDevices.getUserMedia(constraints);
    promise.then(function(MediaStream) {
        video.srcObject = MediaStream;
        video.play();
        render();
    });
}

function render() {
    let ori_canvas = document.getElementById("origin_video")
    let ctx_origin = ori_canvas.getContext("2d");
    let get_video = document.getElementById("video");
    get_video.addEventListener('canplay', function() {
        ori_canvas.width = this.videoWidth;
        ori_canvas.height = this.videoHeight;
    });
    // ori_canvas.width = document.body.clientWidth;
    // ori_canvas.height = document.body.clientHeight;
    window.requestAnimationFrame(render);
    ctx_origin.clearRect(0, 0, ori_canvas.width, ori_canvas.height)
    ctx_origin.drawImage(get_video, 0, 0, ori_canvas.width, ori_canvas.height)
}

function setViewAngle(value) {
    document.getElementById("showVal").innerHTML = value + "px";
    document.getElementById("view3d").style.perspective = value + "px";
}

function setViewScale(value) {
    document.getElementById("showVal_Scale").innerHTML = value;
    $('#view3d').css({
        '-webkit-transform': 'scale(' + value + ',' + value + ')',
        '-moz-transform': 'scale(' + value + ',' + value + ')',
        '-ms-transform': 'scale(' + value + ',' + value + ')',
        '-o-transform': 'scale(' + value + ',' + value + ')',
        'transform': 'scale(' + value + ',' + value + ')'
    });
}

function setViewPosition(value) {
    document.getElementById("showVal_Position").innerHTML = value;
    $('#container_canvas').css({ top: value + 'px' });
}