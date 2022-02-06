function setViewAngle(value, uid, room) {
    document.getElementById("showVal").innerHTML = value + "px";
    $("#player_" + uid).css({ 'perspective': value + 'px' });
    //let player_remote = $("#" + obj).children("div").children("div");
    //player_remote.css({ perspective: value + 'px' });
}

function setViewScale(value, uid, room) {
    // console.log(value);
    // console.log(uid);
    //console.log(room.state.globalState.test);
    // let player_remote = $(".grandVideo").children("div").children("div");
    document.getElementById("showVal_Scale").innerHTML = value;
    //let player_remote = $("#me").children("div").children("div");
    //#player_3320001"
    $("#player_" + uid).css({
        '-webkit-transform': 'scale(' + value + ',' + value + ')',
        '-moz-transform': 'scale(' + value + ',' + value + ')',
        '-ms-transform': 'scale(' + value + ',' + value + ')',
        '-o-transform': 'scale(' + value + ',' + value + ')',
        'transform': 'scale(' + value + ',' + value + ')'
    });
}

function setViewPosition(value, uid, room) {
    document.getElementById("showVal_Position").innerHTML = value;
    //let video_remote = $("#" + obj).children("div").children("div").children("video");
    //video_remote.css({ top: value + 'px' });
    $("#video" + uid).css({ 'top': value + 'px' });
}
// function getMedia() {
//     let constraints = {
//         video: { width: 1080, height: 500 },
//         audio: true
//     };
//     let video = document.getElementById("video");
//     let promise = navigator.mediaDevices.getUserMedia(constraints);
//     promise.then(function(MediaStream) {
//         video.srcObject = MediaStream;
//         video.play();
//         render();
//     });
// }

// function render() {
//     let ori_canvas = document.getElementById("origin_video")
//     let ctx_origin = ori_canvas.getContext("2d");
//     let get_video = document.getElementById("video");
//     get_video.addEventListener('canplay', function() {
//         ori_canvas.width = this.videoWidth;
//         ori_canvas.height = this.videoHeight;
//     });
//     // ori_canvas.width = document.body.clientWidth;
//     // ori_canvas.height = document.body.clientHeight;
//     window.requestAnimationFrame(render);
//     ctx_origin.clearRect(0, 0, ori_canvas.width, ori_canvas.height)
//     ctx_origin.drawImage(get_video, 0, 0, ori_canvas.width, ori_canvas.height)
// }