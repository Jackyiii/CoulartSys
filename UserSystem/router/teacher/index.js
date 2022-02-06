const express = require('express');
const ejs = require("ejs");
const common = require('../../libs/common');
const admin = require("firebase-admin");
const { RtcTokenBuilder, RtcRole } = require('agora-access-token')
const database = admin.database();
const rootRef = database.ref();
const moment = require('moment');
const userRef_schedule_manager = rootRef.child("schedule_manager");
const userRef_schedule_teacher = userRef_schedule_manager.child("teacher_schedule");
const appID = 'cfa1560903554b69b61218c1872349c9';
const appCertificate = '3c7f5c4b731549ca91fbf8a673d0c7f7';
const role = RtcRole.PUBLISHER;
const preMins = 10;
const classMins = 60;
const relayMins = 15;
const validMins = preMins + classMins + relayMins + 5;
//const expirationTimeInSeconds = validMins * 60;
const expirationTimeInSeconds = validMins * 60 * 24;
//const expirationTimeInSeconds = 1 * 60;
const currentTimestamp = Math.floor(Date.now() / 1000)
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
const data_config_agroa = {
    id: appID,
    certificate: appCertificate,
    role: role,
    expire_time: expirationTimeInSeconds,
    current_time: currentTimestamp,
    exprie_total: privilegeExpiredTs
}
const App_Identifier_Netless = "850FUDlrEeuJTUutVz15aw/g1xekColEafM4Q";
const ak = "JP4DqxPdu58ajMZU";
const sk = "v2cF-lvw1hDCkpS0SjZNKvZYK6gy9XiH";

const fetch = require('node-fetch');
const { sdkToken, roomToken, TokenPrefix } = require("../../libs/netless_token.js");
const expire_time = 1000 * expirationTimeInSeconds;
const expire_time_netless = 1000 * 0;
const url_netless = "https://api.netless.link/v5/rooms";
const TokenRole = {
    Admin: "0",
    Writer: "1",
    Reader: "2",
};

const { v4: uuidv4 } = require('uuid');
module.exports = function() {
    var router = express.Router();
    //检查登录状态
    router.use((req, res, next) => {
        if (!req.session['teacher_id'] && req.url != '/login') { //没有登录
            res.redirect('/teacher/login');
        } else {
            next();
        }
    });
    router.get('/', (req, res) => {
        // res.writeHead(200, {
        //     'Content-Type': 'text/plain',
        //     'Access-Control-Allow-Origin': '*',
        //     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
        // });
        current_user = req.session['teacher_id'].toString();
        if (typeof(current_user) != "undefined" && current_user != null) {
            const userRef_teacher_infos = rootRef.child("/teacher_infos/" + current_user);
            userRef_teacher_infos.once("value", snapshot => {
                current_user_uid = snapshot.val().uid;
                console.log("current user:" + current_user + "current user id:" + current_user_uid + "/index");
                res.redirect('/teacher/' + current_user + "/" + current_user_uid + "/my_class");
            });
        }
    });
    router.get('/:user/:uid/my_class', (req, res) => {
        // res.writeHead(200, {
        //     'Content-Type': 'text/plain',
        //     'Access-Control-Allow-Origin': '*',
        //     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
        // });
        let current_date = Date.now();
        let current_user = req.params.user;
        let current_uid = req.params.uid;
        let data_teacher = {};
        var date_futur = [];
        const userRef_teacher_infos = rootRef.child("/teacher_infos/" + current_user);
        const userRef_teacher_schdule = rootRef.child("/schedule_manager/teacher_schedule/" + current_user);
        userRef_teacher_infos.once("value").then(snapshot => {
            data_teacher = snapshot.val();
        });
        userRef_teacher_schdule.once("value", snapshot => {
            snapshot.forEach(function(childSnapshot) {
                if (current_date <= childSnapshot.key) {
                    let current_key = childSnapshot.key;
                    date_futur.push(current_key);
                    userRef_teacher_schdule.child("/" + date_futur[0]).once("value", snapshot => {
                        data_teacher.target_user = snapshot.val();
                    });
                } else {
                    let old_key = childSnapshot.key;
                    let date = new Date(parseInt(old_key));
                    let date_format = date.getFullYear() + "年" + (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "月" + (date.getDate() < 10 ? '0' + date.getDate() + "日 " : date.getDate() + "日 ") + (date.getHours() < 10 ? '0' + date.getHours() + "点" : date.getHours() + "点");
                    userRef_teacher_schdule.update({
                        [old_key]: date_format
                    });
                }
            });
            //res.render('teacher/index.ejs', { user: data_teacher });
            var userRef_cours = rootRef.child("/classroom/" + data_teacher.target_user + "/courseware");
            userRef_cours.once("value", snapshot => {
                if (snapshot.val().num_class == "null") {
                    var current_index = 1;
                } else {
                    var current_index = snapshot.val().num_class;
                }
                var series = snapshot.val().series;
                var series_num = snapshot.val().series_num;
                var index_course = parseInt(current_index);
                let level = snapshot.val().level;
                data_teacher.courseware_series = series;
                data_teacher.courseware_lesson = series_num + "(第" + index_course + "节)";
                let next_date = new Date(parseInt(date_futur[0]));
                let format_date = next_date.getFullYear() + "年" + (next_date.getMonth() < 10 ? '0' + (next_date.getMonth() + 1) : (next_date.getMonth() + 1)) + "月" + (next_date.getDate() < 10 ? '0' + next_date.getDate() + "日 " : next_date.getDate() + "日 ") + (next_date.getHours() < 10 ? '0' + next_date.getHours() + "点" : next_date.getHours() + "点");
                data_teacher.next_class = format_date;
                let srcUserRef = rootRef.child("/courseware/" + series + "/" + level + "/" + series_num + "/" + index_course + "/");
                //var userRef_series = userRef_cours.child("/" + series_num);
                srcUserRef.once("value", snapshot => {
                    data_teacher.src = snapshot.val().url0;
                    res.render('teacher/index.ejs', { user: data_teacher });
                });
                // userRef_series.once("value", snapshot => {
                //     snapshot.forEach(function(childSnapshot) {
                //         if (childSnapshot.key == current_index) {
                //             let lesson = snapshot.val()[index_course];
                //             data_teacher.courseware_series = series;
                //             data_teacher.courseware_lesson = series_num + " ( " + lesson + " ) ";
                //             let date = new Date(parseInt(date_futur[0]));
                //             let date_format = date.getFullYear() + "年" + (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "月" + (date.getDate() < 10 ? '0' + date.getDate() + "日 " : date.getDate() + "日 ") + (date.getHours() < 10 ? '0' + date.getHours() + "点" : date.getHours() + "点");
                //             data_teacher.next_class = date_format;
                //             res.render('teacher/index.ejs', { user: data_teacher });
                //         }
                //     });
                // });
            });

        });
    });
    router.post("/token", (req, res) => {
        // res.writeHead(200, {
        //     'Content-Type': 'text/plain',
        //     'Access-Control-Allow-Origin': '*',
        //     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
        // });
        //TODO //////////////////////////////////////////////////////////////////////
        var data = {
            uid: req.body.uid,
            target_room: req.body.target_child,
            channel: req.body.target_child
        }
        const userRef_classroom = rootRef.child("/classroom/" + data.target_room);
        console.log("AppID: " + data_config_agroa.id + " /AppCertificat: " + data_config_agroa.certificate + " /Role: " + data_config_agroa.role + " /Expire Time Seconde: " + data_config_agroa.expire_time);
        data.token = RtcTokenBuilder.buildTokenWithUid(data_config_agroa.id, data_config_agroa.certificate, data.channel, parseInt(data.uid), data_config_agroa.role, data_config_agroa.exprie_total);
        userRef_classroom.update({ token_teacher: data.token, channel: data.channel });
        console.log("uuid:" + data.channel);
        const netlessSDKToken = sdkToken(ak, sk, expire_time, {
            role: TokenRole.Admin
        });
        userRef_classroom.update({ netless_sdkToken: netlessSDKToken });
        var requestInit = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "token": netlessSDKToken,
            },
        };
        fetch(url_netless, requestInit).then(function(response) {
            return response.json();
        }).then(function(roomJSON) {
            console.log(roomJSON);
            userRef_classroom.update({ netless_roomUUID: roomJSON.uuid });
            const netlessRoomToken = roomToken(ak, sk, expire_time, {
                role: TokenRole.Admin, // 2 option with verification TokenRole.Admin / TokenRole.Writer
                uuid: roomJSON.uuid
            });
            console.log("room is " + netlessRoomToken);
            userRef_classroom.update({ netless_roomToken_teacher: netlessRoomToken });
            res.send(data);
        });
    });

    router.use('/login', require('./login')());

    return router;
};







// let current_user = req.session['teacher_id'].toString();
// const userRef_teacher_infos = rootRef.child("/teacher_infos/" + current_user);
// const userRef_current = userRef_schedule_teacher.child(current_user);
// var now_time = new Date();
// var now_timestamp = Date.parse(now_time);
// var timestamp_arr = [];
// var time_format_next = "";
// console.log("now date is:" + now_time);
// console.log("now time stamp is:" + now_timestamp);
// userRef_current.once("value", snapshot => {
//     snapshot.forEach(function(childSnapshot) {
//         var child_key = parseInt(childSnapshot.key);
//         console.log(child_key);
//         if (!isNaN(child_key)) {
//             if (now_timestamp > child_key) {
//                 console.log("moment:" + moment(child_key).format());
//                 child_key += "_old";
//             } else {
//                 console.log("future:" + child_key);
//                 timestamp_arr.push(child_key);
//             }
//         }
//     });
//     console.log("length" + timestamp_arr.length);
//     timestamp_arr.sort((a, b) => {
//         return a - b;
//     });
//     snapshot.forEach(function(childSnapshot) {
//         if (childSnapshot.key == timestamp_arr[0]) {
//             nextclass_clannel = childSnapshot.val();
//             time_format_next = moment(timestamp_arr[0]).format('YYYY-MM-DD HH:mm');
//             console.log('next channel is :' + nextclass_clannel);
//         }
//     });
// });
// const userRef_getchild = rootRef.child("/student_infos/" + nextclass_clannel);
// userRef_getchild.once("value", snapshot => {
//     childData = snapshot.val();
// });
// userRef_teacher_infos.once("value", snapshot => {
//     var data = snapshot.val();
//     var id = snapshot.val().uid;
//     res.redirect('/teacher/' + current_user + id + "/my_class");
//     console.log(req.session['teacher_id'] + "/ data is :" + JSON.stringify(data) + "channel is :" + nextclass_clannel);
//     router.get('/' + current_user + id + "/my_class", (req, res) => {
//         res.render('teacher/index.ejs', { user: data, user_child: childData, channel: nextclass_clannel, next_time: time_format_next });
//     });
// });
// });
// router.post("/token", (req, res) => {
// var current_user = req.session['teacher_id'].toString();
// var channel = req.body.channel;
// console.log("teacher_channel is " + channel);
// const userRef_classroom = rootRef.child("/classroom/" + channel);
// var data = {
//     uid: req.body.uid,
//     channel: channel,
//     token: "token"
// }
// console.log("uid: " + data.uid + " /channel: " + data.channel)
// console.log("AppID: " + data_config_agroa.id + " /AppCertificat: " + data_config_agroa.certificate + " /Role: " + data_config_agroa.role + " /Expire Time Seconde: " + data_config_agroa.expire_time);
// data.token = RtcTokenBuilder.buildTokenWithUid(data_config_agroa.id, data_config_agroa.certificate, data.channel, parseInt(data.uid), data_config_agroa.role, data_config_agroa.exprie_total);
// userRef_classroom.update({ token_teacher: data.token });
// console.log(data.token);
// res.send(data);
// // res.redirect("http://127.0.0.1:3001/teacher/" + data.channel)
// });