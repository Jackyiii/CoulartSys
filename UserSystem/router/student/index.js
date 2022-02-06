const express = require('express');
const ejs = require("ejs");
const common = require('../../libs/common');
const admin = require("firebase-admin");
const { RtcTokenBuilder, RtcRole } = require('agora-access-token')
const database = admin.database();
const rootRef = database.ref();
const appID = 'cfa1560903554b69b61218c1872349c9';
const appCertificate = '3c7f5c4b731549ca91fbf8a673d0c7f7';
const role = RtcRole.PUBLISHER;
const preMins = 10;
const classMins = 60;
const relayMins = 15;
const validMins = preMins + classMins + relayMins + 5;
//const expirationTimeInSeconds = validMins * 60;
//const expirationTimeInSeconds = 1 * 60;
const expirationTimeInSeconds = validMins * 60 * 24;
const expire_time = 1000 * expirationTimeInSeconds;
const expire_time_netless = 1000 * 0;
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
var data_myclass = {};
var date_futur = [];
//token netless
const AppIdentifier = "850FUDlrEeuJTUutVz15aw/g1xekColEafM4Q";
const fetch = require('node-fetch');
const { sdkToken, roomToken, TokenPrefix } = require("../../libs/netless_token.js");
const ak = "JP4DqxPdu58ajMZU";
const sk = "v2cF-lvw1hDCkpS0SjZNKvZYK6gy9XiH";
const url_netless = "https://api.netless.link/v5/rooms";
const TokenRole = {
    Admin: "0",
    Writer: "1",
    Reader: "2",
};
var uuid = "";
module.exports = function() {
    var router = express.Router();
    //检查登录状态
    router.use((req, res, next) => {
        if (!req.session['student_id'] && req.url != '/login') { //没有登录
            res.redirect('/student/login');
        } else {
            next();
        }
    });

    router.get('/', (req, res) => {
        let current_user = req.session['student_id'].toString();
        const userRef_student_infos = rootRef.child("/student_infos/" + current_user);
        const userRef_classroom = rootRef.child("/classroom/" + current_user);
        const userRef_cours = userRef_classroom.child("/courseware");
        const userRef_student_date = rootRef.child("/schedule_manager/student_schedule/" + current_user);
        console.log("获取当前时间秒数" + Date.now());
        var current_date = Date.now();
        let date_futur = [];
        userRef_student_date.once("value", snapshot => {
            snapshot.forEach(function(childSnapshot) {
                if (current_date <= childSnapshot.key) {
                    let current_key = childSnapshot.key;
                    let date = new Date(parseInt(current_key));
                    let date_format = date.getFullYear() + "年" + (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "月" + (date.getDate() < 10 ? '0' + date.getDate() + "日 " : date.getDate() + "日 ") + (date.getHours() < 10 ? '0' + date.getHours() + "点" : date.getHours() + "点");
                    date_futur.push(date_format);
                } else {
                    let old_key = childSnapshot.key;
                    let date = new Date(parseInt(old_key));
                    let date_format = date.getFullYear() + "年" + (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "月" + (date.getDate() < 10 ? '0' + date.getDate() + "日 " : date.getDate() + "日 ") + (date.getHours() < 10 ? '0' + date.getHours() + "点" : date.getHours() + "点");
                    let val_out = snapshot.val()[childSnapshot.key];
                    //var str_out = date_format + " / " + val_out + " / out "
                    userRef_student_date.update({
                        [old_key]: date_format
                    });
                }
            });
        });
        userRef_student_infos.once("value", snapshot => {
            data_myclass = snapshot.val();
            var id = snapshot.val().uid;
            res.redirect('/student/' + current_user + id + "/my_class");
            console.log(req.session['student_id'] + "/ data is :" + JSON.stringify(data_myclass));
            router.get('/' + current_user + id + "/my_class", (req, res) => {
                userRef_cours.once("value", snapshot => {
                    var current_index = snapshot.val().num_class;
                    var series = snapshot.val().series;
                    var series_num = snapshot.val().series_num;
                    var index_course = parseInt(current_index);
                    let level = snapshot.val().level;
                    data_myclass.courseware_series = series;
                    data_myclass.courseware_lesson = series_num + "(第" + index_course + "节)";
                    data_myclass.next_class = date_futur[0];
                    let srcUserRef = rootRef.child("/courseware/" + series + "/" + level + "/" + series_num + "/" + index_course + "/");
                    srcUserRef.once("value", snapshot => {
                        data_myclass.src = snapshot.val().url0;
                        res.render('student/index.ejs', { user: data_myclass });
                    });
                });
            });
        });
    });

    router.post("/token", (req, res) => {
        var current_user = req.session['student_id'].toString();
        var data = {
            uid: req.body.uid,
            target_room: current_user
        }
        console.log("current user " + current_user);
        const userRef_classroom = rootRef.child("/classroom/" + current_user);
        userRef_classroom.once("value", snapshot => {
            data.channel = current_user;
            //let netless_sdkToken = snapshot.val().netless_sdkToken;
            let netless_roomUUID = snapshot.val().netless_roomUUID;
            console.log("uid: " + data.uid + " /channel: " + data.channel)
            console.log("AppID: " + data_config_agroa.id + " /AppCertificat: " + data_config_agroa.certificate + " /Role: " + data_config_agroa.role + " /Expire Time Seconde: " + data_config_agroa.expire_time);
            data.token = RtcTokenBuilder.buildTokenWithUid(data_config_agroa.id, data_config_agroa.certificate, data.channel, parseInt(data.uid), data_config_agroa.role, data_config_agroa.exprie_total);
            userRef_classroom.update({ token_student: data.token });
            const netlessRoomToken = roomToken(ak, sk, expire_time, {
                role: TokenRole.Admin, // 可以选择 TokenRole.Admin / TokenRole.Writer
                uuid: netless_roomUUID
            });
            userRef_classroom.update({ netless_roomToken_student: netlessRoomToken });
            res.send(data);
        });
    });

    router.use('/login', require('./login')());

    return router;
};
// var requestInit = {
//     method: "POST",
//     headers: {
//         "content-type": "application/json",
//         "token": netlessSDKToken,
//         "region": "us-sv", // 签发的 SDK Token，需提前准备
//     },
// };
// console.log(netlessSDKToken);
// fetch(url_netless, requestInit).then(function(response) {
//     return response.json();
// }).then(function(roomJSON) {
//     console.log(roomJSON);
//     uuid = roomJSON.uuid;
//     const netlessRoomToken = roomToken(ak, sk, expire_time, {
//         role: TokenRole.Admin,
//         uuid: uuid
//     });
//     console.log("roomToken=" + netlessRoomToken);
//     userRef_classroom.update({ token_netless_student: netlessRoomToken, uuid_netless_student: uuid });
//     res.send(data);
// }).catch(function(err) {
//     console.error(err);
// });