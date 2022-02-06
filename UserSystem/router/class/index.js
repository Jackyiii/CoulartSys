const express = require('express');
const common = require('../../libs/common');
const admin = require("firebase-admin");

const database = admin.database();
const rootRef = database.ref();

const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const preMins = 10;
const classMins = 60;
const relayMins = 15;
const validMins = preMins + classMins + relayMins + 5;
//const expirationTimeInSeconds = validMins * 60;
const expirationTimeInSeconds = validMins * 60 * 24;
//const expirationTimeInSeconds = 1 * 60;
const currentTimestamp = Math.floor(Date.now() / 1000)
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

const appID = 'cfa1560903554b69b61218c1872349c9';
const appCertificate = '3c7f5c4b731549ca91fbf8a673d0c7f7';
const role = RtcRole.PUBLISHER;

const data_config_agroa = {
    id: appID,
    certificate: appCertificate,
    role: role,
    expire_time: expirationTimeInSeconds,
    current_time: currentTimestamp,
    exprie_total: privilegeExpiredTs
}
module.exports = function() {
    var router = express.Router();
    //检查登录状态
    router.use((req, res, next) => {
        if (!req.session['student_id'] && !req.session['teacher_id'] && req.url != '/login') { //没有登录
            res.redirect('/');
        } else {
            next();
        }
    });
    router.post("/token", (req, res) => {
        let renew_token = {};
        console.log(req.body.channel);
        console.log(req.body.channel.length);
        console.log(parseInt(req.body.uid));
        console.log(data_config_agroa.exprie_total);
        let token = RtcTokenBuilder.buildTokenWithUid(data_config_agroa.id, data_config_agroa.certificate, req.body.channel, parseInt(req.body.uid), data_config_agroa.role, data_config_agroa.exprie_total);
        console.log(token);
        renew_token.token = token;
        res.send(renew_token);
    });
    router.post("/", (req, res) => {
        // res.writeHead(200, {
        //     'Content-Type': 'text/plain',
        //     'Access-Control-Allow-Origin': '*',
        //     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
        // });
        let classroom = req.body.room;
        let uid = req.body.uid;
        let channel = req.body.channel;
        let data_user = {};
        const userRef_classroom = rootRef.child("/classroom/" + classroom);
        const userRef_classroom_config = rootRef.child("/classroom/config");
        const userRef_classroom_courseware_lib = rootRef.child("/courseware");
        const userRef_classroom_couserware_infos = userRef_classroom.child("/courseware");
        userRef_classroom.once("value", snapshot => {
            if (uid == snapshot.val().uid_student) {
                data_user.rtc_channel = snapshot.val().channel;
                //data_user.number_class = snapshot.val().number_class;
                data_user.user = snapshot.val().student_user;
                data_user.rtc_token = snapshot.val().token_student;
                data_user.rtc_uid = snapshot.val().uid_student;
                data_user.netless_roomUUID = snapshot.val().netless_roomUUID;
                data_user.netless_sdkToken = snapshot.val().netless_sdkToken;
                data_user.netless_roomToken = snapshot.val().netless_roomToken_student;
                userRef_classroom_config.once("value", snapshot => {
                    data_user.id_netless = snapshot.val().id_netless;
                    userRef_classroom_couserware_infos.once("value", snapshot => {
                        data_user.num_class = snapshot.val().num_class;
                        data_user.level = snapshot.val().level;
                        data_user.series = snapshot.val().series;
                        data_user.series_num = snapshot.val().series_num.toString();
                        let coursware_selector = "/" + data_user.series + "/" + data_user.level + "/" + data_user.series_num + "/" + data_user.num_class;
                        let urlImge = [];
                        console.log(coursware_selector);
                        userRef_classroom_courseware_lib.child(coursware_selector).once("value", snapshot => {
                            snapshot.forEach(function(childSnapshot) {
                                urlImge.push(childSnapshot.val());
                                console.log("url is " + childSnapshot.val());
                            });
                            data_user.url_courseware = urlImge;
                            console.log(data_user.url_courseware);
                            res.send(data_user);
                        });
                    });
                });
            } else {
                data_user.rtc_channel = snapshot.val().channel;
                //data_user.number_class = snapshot.val().number_class;
                data_user.user = snapshot.val().teacher_user;
                data_user.rtc_token = snapshot.val().token_teacher;
                data_user.rtc_uid = snapshot.val().uid_teacher;
                data_user.netless_roomUUID = snapshot.val().netless_roomUUID;
                data_user.netless_sdkToken = snapshot.val().netless_sdkToken;
                data_user.netless_roomToken = snapshot.val().netless_roomToken_teacher;
                userRef_classroom_config.once("value", snapshot => {
                    data_user.id_netless = snapshot.val().id_netless;
                    userRef_classroom_couserware_infos.once("value", snapshot => {
                        data_user.num_class = snapshot.val().num_class;
                        data_user.level = snapshot.val().level;
                        data_user.series = snapshot.val().series;
                        data_user.series_num = snapshot.val().series_num.toString();
                        let coursware_selector = "/" + data_user.series + "/" + data_user.level + "/" + data_user.series_num + "/" + data_user.num_class;
                        let urlImge = [];
                        console.log(coursware_selector);
                        userRef_classroom_courseware_lib.child(coursware_selector).once("value", snapshot => {
                            snapshot.forEach(function(childSnapshot) {
                                urlImge.push(childSnapshot.val());
                                console.log("url is " + childSnapshot.val());
                            });
                            data_user.url_courseware = urlImge;
                            console.log(data_user.url_courseware);
                            res.send(data_user);
                        });
                    });
                });

            }
        });
    });

    router.get('/:room', (req, res) => {
        console.log(req.params.room);
        var room_target = req.params.room;
        var uid = parseInt(req.query.uid);
        var data = {};
        const userRef_classroom = rootRef.child("/classroom/" + room_target);
        userRef_classroom.once("value", snapshot => {
            if (uid == snapshot.val().uid_student) {
                data.uid = uid;
                console.log("Value OF !!!!!" + typeof data.uid);
                data.token = snapshot.val().token_student;
                data.channel = snapshot.val().channel;
                data.room = room_target;
                console.log("uid_student-" + data.uid + "channel-" + data.channel + "token-" + data.token);
                res.render('component/classroom.ejs', data);
            } else {
                data.uid = uid;
                console.log("Value OF !!!!!" + typeof data.uid);
                data.token = snapshot.val().token_teacher;
                data.channel = snapshot.val().channel;
                data.room = room_target;
                console.log("uid_teacher-" + data.uid + "channel-" + data.channel + "token-" + data.token);
                res.render('component/classroom.ejs', data);
            }
        });
    });

    return router;
};