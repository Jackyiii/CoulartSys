function getRtcVideo(uid, channel, token) {
    $("#remote-container").empty();
    let old_data = {};
    let path = "/class/token";
    old_data.uid = uid;
    old_data.channel = channel;
    old_data.token = token;

    let draggie = new Draggabilly('.draggable');
    const rtc_config = {
        "mode": "live",
        "codec": "h264",
        "app_id": "cfa1560903554b69b61218c1872349c9"
    }
    let handleFail = function(err) {
        console.log("Old Uid" + old_data.uid);
        console.log("Old Channel" + old_data.channel);
        console.log("Old Token" + old_data.token);
        $.post(path, old_data, function(data) {
            console.log(data.token);
            console.log("onTokenPrivilegeDidExpire success2");
            client.renewToken(data.token);
            //client.join(data.token, old_data.channel, 3320001);
            // await client.renewToken(data.token);
            // client.join(data.token, channel, uid);
        });
    };
    // Client Setup
    // Defines a client for RTC
    let client = AgoraRTC.createClient({
        mode: rtc_config.mode,
        codec: rtc_config.codec
    });
    // Client Setup
    // Defines a client for Real Time Communication
    client.init(rtc_config.app_id, () => console.log("AgoraRTC client initialized"), handleFail);

    // The client joins the channel
    client.join(token, channel, uid, (uid) => {
        // Stream object associated with your web cam is initialized
        let localStream = AgoraRTC.createStream({
            streamID: uid,
            audio: true,
            video: true,
            screen: false
        });


        // Associates the stream to the client
        localStream.init(function() {
            //Plays the localVideo
            localStream.play('me');
            localStream.unmuteAudio();
            //Publishes the stream to the channel
            client.publish(localStream, handleFail);

        }, handleFail);

    }, handleFail);
    //When a stream is added to a channel
    client.on('stream-added', function(evt) {
        $("#remote-container").empty();
        client.subscribe(evt.stream, handleFail);
    });
    //When you subscribe to a stream
    client.on('stream-subscribed', function(evt) {
        // removeVideoStream(streamId);

        let stream = evt.stream;
        console.log(stream);
        let streamId = String(stream.getId());
        addVideoStream(streamId);
        stream.play(streamId);
        render(streamId);
    });
    //When a person is removed from the stream
    client.on('stream-removed', function(evt) {
        let stream = evt.stream;
        let streamId = String(stream.getId());
        // alert(streamId);
        stream.close();
        removeVideoStream(streamId);
    });
    client.on('peer-leave', function(evt) {
        let stream = evt.stream;
        let streamId = String(stream.getId());
        stream.close();
        removeVideoStream(streamId);
    });
    client.on("onTokenPrivilegeDidExpire", function() {
        console.log("Old Uid" + old_data.uid);
        console.log("Old Channel" + old_data.channel);
        console.log("Old Token" + old_data.token);
        $.post(path, old_data, function(data) {
            console.log(data.token);
            console.log("onTokenPrivilegeDidExpire success2");
            client.renewToken(data.token);
            //client.join(data.token, old_data.channel, 3320001);
            // await client.renewToken(data.token);
            // client.join(data.token, channel, uid);
        });
    });
    client.on("onTokenPrivilegeWillExpire", function() {
        console.log("Old Uid" + old_data.uid);
        console.log("Old Channel" + old_data.channel);
        console.log("Old Token" + old_data.token);
        $.post(path, old_data, function(data) {
            console.log(data.token);
            console.log("onTokenPrivilegeWillExpire success2");
            client.renewToken(data.token);

            // await client.renewToken(data.token);
            // client.join(data.token, channel, uid);
        });
    });
    // client.on("onTokenPrivilegeWillExpire", async function() {
    //     await $.post(path, data, async function(data) {
    //         console.log("onTokenPrivilegeWillExpire success2");
    //         await client.renewToken(data.token);
    //         client.join(data.token, channel, uid);
    //     });
    // });
    // client.on("token-privilege-will-expire", async function() {
    //     await $.post(path, data, async function(data) {
    //         console.log("token-privilege-will-expire success2");
    //         await client.renewToken(data.token);
    //         client.join(data.token, channel, uid);
    //     });
    // });

    // client.on("onTokenPrivilegeWillExpire", function() {
    //     //After requesting a new token
    //     console.log("试试看2");
    //     $.post(path, data, function(data) {
    //         await client.renewToken(data.token);
    //         //client.renewToken(data.token);
    //         // client.join(data.token, channel, uid);
    //     });
    // });
    // client.on('mute-audio', function(evt) {
    //     let stream = evt.stream;
    //     stream.muteAudio();
    //     console.log('Mute Audio for: ' + evt.uid);
    // });
}

// function render(stream_remote) {
//     // $("#remote-container").hide();
//     let get_remote_canvas = document.getElementById("remote_video");
//     let ctx_remote = get_remote_canvas.getContext("2d");
//     let get_remote_video = document.getElementById("video" + stream_remote);
//     get_remote_video.addEventListener('play', function() {
//         // alert("1");
//         get_remote_canvas.width = this.videoWidth;
//         get_remote_canvas.height = this.videoHeight;
//     });
//     window.requestAnimationFrame(render);
//     get_remote_video.addEventListener('play', function() {
//         draw(this, ctx_remote, get_remote_canvas.width, get_remote_canvas.height);
//     }, false);
//     // ctx_remote.clearRect(0, 0, get_remote_canvas.width, get_remote_canvas.height)
//     // ctx_remote.drawImage(get_remote_video, 0, 0, get_remote_canvas.width, get_remote_canvas.height)
// }

// function draw(v, c, w, h) {
//     if (v.paused || v.ended) return false;
//     c.drawImage(v, 0, 0, w, h);
//     setTimeout(draw, 30, v, c, w, h);
// }

// $.post(rtc_config.path_token, function(data) {
//     let uid = data.uid_student;
//     let channel = data.channel;
//     let token = data.token_student;
//     // The client joins the channel
//     client.join(token, channel, uid, (uid) => {
//         // Stream object associated with your web cam is initialized
//         let localStream = AgoraRTC.createStream({
//             streamID: uid,
//             audio: true,
//             video: true,
//             screen: false
//         });
//         // Associates the stream to the client
//         localStream.init(function() {
//             //Plays the localVideo
//             localStream.play('me');
//             //Publishes the stream to the channel
//             client.publish(localStream, handleFail);

//         }, handleFail);

//     }, handleFail);
//     //When a stream is added to a channel
//     client.on('stream-added', function(evt) {
//         client.subscribe(evt.stream, handleFail);
//     });
//     //When you subscribe to a stream
//     client.on('stream-subscribed', function(evt) {
//         let stream = evt.stream;
//         let streamId = String(stream.getId());
//         addVideoStream(streamId);
//         stream.play(streamId);
//     });
//     //When a person is removed from the stream
//     client.on('stream-removed', function(evt) {
//         let stream = evt.stream;
//         let streamId = String(stream.getId());
//         stream.close();
//         removeVideoStream(streamId);
//     });
//     client.on('peer-leave', function(evt) {
//         let stream = evt.stream;
//         let streamId = String(stream.getId());
//         stream.close();
//         removeVideoStream(streamId);
//     });
// });

// let str_uid = <%= uid%>;
// let uid = parseInt(str_uid);
// let channel = "<%= channel %>";
// let token = "<%= token%>";
// alert("uid:" + uid);
// alert("channel:" + channel);
// alert("token:" + token);