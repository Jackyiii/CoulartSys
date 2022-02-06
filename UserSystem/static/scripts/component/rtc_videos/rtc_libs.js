/**
 * @name addVideoStream
 * @param streamId
 * @description Helper function to add the video stream to "remote-container"
 */


function addVideoStream(elementId) {
    let remoteContainer = document.getElementById("remote-container");
    let streamDiv = document.createElement("div"); // Create a new div for every stream
    streamDiv.id = elementId; // Assigning id to div
    //alert(elementId);
    streamDiv.style.transform = "rotateY(180deg)"; // Takes care of lateral inversion (mirror image)
    remoteContainer.appendChild(streamDiv); // Add new div to container
}
/**
 * @name removeVideoStream
 * @param evt - Remove event
 * @description Helper function to remove the video stream from "remote-container"
 */
function removeVideoStream(evt) {
    let remDiv = document.getElementById(elementId);
    if (remDiv) bremDiv.parentNode.removeChild(remDiv);
    // let stream = evt.stream;
    // stream.stop();
    // let remDiv = document.getElementById(stream.getId());
    // remDiv.parentNode.removeChild(remDiv);
    // console.log("Remote stream is removed " + stream.getId());
}

// function addCanvas(streamId) {
//     let canvasContainer = document.getElementById("canvas-container");
//     let canvas = document.createElement("canvas");
//     canvas.id = 'canvas' + streamId;
//     canvasContainer.appendChild(canvas);
//     let ctx = canvas.getContext('2d');
//     let video = document.getElementById(`video${streamId}`);

//     video.addEventListener('loadedmetadata', function() {
//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;
//     });

//     video.addEventListener('play', function() {
//         var $this = this; //cache
//         (function loop() {
//             if (!$this.paused && !$this.ended) {
//                 ctx.drawImage($this, 0, 0);
//                 setTimeout(loop, 1000 / 30); // drawing at 30fps
//             }
//         })();
//     }, 0);
// }