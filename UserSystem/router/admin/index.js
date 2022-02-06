const express = require('express');
const common = require('../../libs/common');
const admin = require("firebase-admin");
const database = admin.database();
const rootRef = database.ref();
const userRef_teacher = rootRef.child("/teacher/");
const userRef_teacher_infos = rootRef.child("/teacher_infos/");
const userRef_student = rootRef.child("/student/");
const userRef_student_infos = rootRef.child("/student_infos/");
const schedule_manager = rootRef.child("/schedule_manager/");
const userRef_classroom = rootRef.child("/classroom/");
const userRef_courseware = rootRef.child("/courseware");
var current_user;
// var series_data;
// var level_data;
// var series_num_data;
module.exports = function() {
    var router = express.Router();
    router.use((req, res, next) => {
        if (!req.session['admin_id'] && req.url != '/login') { //没有登录
            res.redirect('/admin/login');
        } else {
            next();
        }
    });
    router.get('/', (req, res, next) => {
        current_user = req.session['admin_id'].toString();
        console.log("currentUser:" + current_user);
        userRef_admin_infos = rootRef.child("/super_admin_infos/" + current_user);
        res.redirect("/admin/geniusSignIn");
    });
    //老师注册
    router.get("/geniusSignIn", (req, res) => {
        const userRef_admin_infos = rootRef.child("/super_admin_infos/" + current_user);
        userRef_admin_infos.once("value", snapshot => {
            var data = snapshot.val();
            res.render('admin/index.ejs', { user: data, url_path: "geniusSignIn" });
        });

    });
    router.get("/studentSign", (req, res) => {
        console.log("学生注册");
        const userRef_admin_infos = rootRef.child("/super_admin_infos/" + current_user);
        userRef_admin_infos.once("value", snapshot => {
            var data = snapshot.val();
            res.render('admin/index.ejs', { user: data, url_path: "studentSign" });
        });
    });
    router.get("/controlClass/level", (req, res) => {
        let series = req.query.series;
        let arr_level = [];
        var usr_level = rootRef.child("/courseware/" + series);
        usr_level.once("value", snapshot => {
            snapshot.forEach(function(child) {
                arr_level.push(child.key);
            });
            res.send(arr_level);
        });
    });
    router.get("/controlClass/set", (req, res) => {
        console.log(req.query.series);
        console.log(req.query.level);
        let get_series = req.query.series;
        let get_level = req.query.level;
        let arr_set = [];
        var usr_set = rootRef.child("/courseware/" + get_series + "/" + get_level);
        usr_set.once("value", snapshot => {
            snapshot.forEach(function(child) {
                console.log(child.key);
                arr_set.push(child.key);
            });
            res.send(arr_set);
        });
    });
    router.get("/controlClass", (req, res) => {
        var user_student_list = [];
        var user_teacher_list = [];
        var zone_time_list = {};
        var schedule_data = {};
        var data_courseware = [];
        userRef_courseware.once("value", snapshot => {
            snapshot.forEach(function(child) {
                data_courseware.push(child.key);
            })
        });
        userRef_student.once("value", snapshot => {
            var length = snapshot.numChildren();
            if (length > 0) {
                snapshot.forEach(function(childSnapshot) {
                    var uid = childSnapshot.val().uid;
                    var user = childSnapshot.val().user;
                    user_student_list.push({ uid, user });
                    // console.log(user_student_list);
                });
            }
        });
        userRef_student_infos.once("value", snapshot => {
            snapshot.forEach(function(childSnapshot) {
                var zone_time = childSnapshot.val().zone_time;
                var user = childSnapshot.val().user;
                zone_time_list[user] = zone_time;
                //console.log(zone_time_list);
            });
        });
        userRef_teacher.once("value", snapshot => {
            var length = snapshot.numChildren();
            if (length > 0) {
                snapshot.forEach(function(childSnapshot) {
                    var uid = childSnapshot.val().uid;
                    var user = childSnapshot.val().user;
                    user_teacher_list.push({ uid, user });
                });
            }
        });
        schedule_manager.child("/teacher_schedule/").once("value", snapshot => {
            schedule_data = snapshot.val();
            //console.log(schedule_data);
        });
        const userRef_admin_infos = rootRef.child("/super_admin_infos/" + current_user);
        userRef_admin_infos.once("value", snapshot => {
            var data = snapshot.val();
            res.render('admin/index.ejs', { user: data, url_path: "controlClass", user_student_list, user_teacher_list, schedule_data, zone_time_list, data_courseware });
        });
    });
    router.get("/manageStudent", (req, res) => {
        console.log("学生管理");
        var user_student_list = [];
        userRef_student.once("value", snapshot => {
            var length = snapshot.numChildren();
            if (length > 0) {
                snapshot.forEach(function(childSnapshot) {
                    var uid = childSnapshot.val().uid;
                    var user = childSnapshot.val().user;
                    user_student_list.push({ uid, user });
                    // console.log(user_student_list);
                });
            }
        });
        const userRef_admin_infos = rootRef.child("/super_admin_infos/" + current_user);
        userRef_admin_infos.once("value", snapshot => {
            var data = snapshot.val();
            res.render('admin/index.ejs', { user: data, url_path: "manageStudent", user_student_list });
        });
    });
    router.get("/manageStudent/getUser", (req, res) => {
        let get_usr = req.query.user;
        userRef_student_infos.child("/" + get_usr).once("value", snapshot => {
            let usr_data = snapshot.val();
            res.send(usr_data);
        })
    })
    router.get("/manageGenius", (req, res) => {
        console.log("Genius管理");
        var user_genius_list = [];
        userRef_teacher.once("value", snapshot => {
            var length = snapshot.numChildren();
            if (length > 0) {
                snapshot.forEach(function(childSnapshot) {
                    var uid = childSnapshot.val().uid;
                    var user = childSnapshot.val().user;
                    user_genius_list.push({ uid, user });
                    // console.log(user_student_list);
                });
            }
        });
        const userRef_admin_infos = rootRef.child("/super_admin_infos/" + current_user);
        userRef_admin_infos.once("value", snapshot => {
            var data = snapshot.val();
            res.render('admin/index.ejs', { user: data, url_path: "manageGenius", user_genius_list });
        });
    });
    router.get("/manageGenius/getUser", (req, res) => {
        let get_usr = req.query.user;
        userRef_teacher_infos.child("/" + get_usr).once("value", snapshot => {
            let usr_data = snapshot.val();
            res.send(usr_data);
        })
    })
    router.post('/emploiSign/user', (req, res) => {
        var data_length = 0;
        var uid = 0;
        var resident_country = req.body.emploi_resident_country;
        var user = req.body.emploi_username;
        var emploi_en = "英文/" + req.body.emploi_en;
        var emploi_fr = "法语/" + req.body.emploi_fr;
        var emploi_ch = "中文/" + req.body.emploi_ch;
        userRef_teacher.once("value", snapshot => {
            data_length = parseInt(snapshot.numChildren()) + 1;
            console.log(data_length);
            user_order = 20000 + data_length;
            if (resident_country == "中国") {
                resident_country = "86";
                uid = parseInt(resident_country + user_order.toString());
            } else if (resident_country == "法国") {
                resident_country = "33";
                uid = parseInt(resident_country + user_order.toString());
            } else if (resident_country == "美国") {
                resident_country = "10";
                uid = parseInt(resident_country + user_order.toString());
            } else {
                resident_country = "99";
                uid = parseInt(resident_country + user_order.toString());
            }
            console.log("mail:" + req.body.emploi_mail + "order:" + user_order + "uid:" + uid + "user:" + user);
            userRef_teacher.child("/" + data_length).set({
                email: req.body.emploi_mail,
                order: user_order,
                password: "000",
                uid: uid,
                user: user
            });
            userRef_teacher_infos.child("/" + user).set({
                uid: uid,
                user: user,
                emploi_first_name: req.body.emploi_first_name,
                emploi_last_name: req.body.emploi_last_name,
                emploi_mail: req.body.emploi_mail,
                emploi_birth_year: req.body.emploi_birth_year,
                emploi_birth_month: req.body.emploi_birth_month,
                emploi_birth_day: req.body.emploi_birth_day,
                emploi_contact_tel: req.body.emploi_contact_tel,
                emploi_contact_other: req.body.emploi_contact_other,
                emploi_sex: req.body.emploi_sex,
                education_select: req.body.emploi_education_select,
                emploi_diplome: req.body.emploi_diplome,
                emploi_emploi_diplomeOther: req.body.emploi_diplomeOther,
                emploi_post_select: req.body.emploi_post_select,
                emploi_post_select_2: req.body.emploi_post_select_2,
                emploi_resident_country: req.body.emploi_resident_country,
                emploi_addr_resident: req.body.emploi_addr_resident,
                emploi_bank_infos: req.body.emploi_bank_infos,
                emploi_emploi_compte: req.body.emploi_emploi_compte,
                emploi_emploi_compte_name: req.body.emploi_emploi_compte_name,
                emploi_remark: req.body.emploi_remark,
                emploi_exigence_name: req.body.emploi_exigence_name,
                emploi_exigence_tel: req.body.emploi_exigence_tel,
                emploi_en: emploi_en,
                emploi_fr: emploi_fr,
                emploi_ch: emploi_ch
            });
        });
        res.redirect('/admin/geniusSignIn/');
    });

    router.post('/studentSign/user', (req, res) => {
        var data_length = 0;
        var uid = 0;
        var resident_country = req.body.student_resident_country;
        var user = req.body.student_username;
        var student_en = "英文/" + req.body.student_en;
        var student_fr = "法语/" + req.body.student_fr;
        var student_ch = "中文/" + req.body.student_ch;

        userRef_student.once("value", snapshot => {
            data_length = parseInt(snapshot.numChildren()) + 1;
            console.log(data_length);
            user_order = 10000 + data_length;
            if (resident_country == "中国") {
                resident_country = "86";
                uid = parseInt(resident_country + user_order.toString());
            } else if (resident_country == "法国") {
                resident_country = "33";
                uid = parseInt(resident_country + user_order.toString());
            } else if (resident_country == "美国") {
                resident_country = "10";
                uid = parseInt(resident_country + user_order.toString());
            } else {
                resident_country = "99";
                uid = parseInt(resident_country + user_order.toString());
            }
            console.log("mail:" + req.body.student_mail + "order:" + user_order + "uid:" + uid + "user:" + user);
            userRef_student.child("/" + data_length).set({
                email: req.body.student_mail,
                order: user_order,
                password: "000",
                uid: uid,
                user: user
            });
            userRef_student_infos.child("/" + user).set({
                uid: uid,
                user: user,
                student_first_name: req.body.student_first_name,
                student_last_name: req.body.student_last_name,
                student_mail: req.body.student_mail,
                student_year: req.body.student_year,
                student_month: req.body.student_month,
                student_day: req.body.student_day,
                student_age: req.body.student_age,
                student_tel: req.body.student_tel,
                student_contact_other: req.body.student_contact_other,
                student_sex: req.body.student_sex,
                student_en: student_en,
                student_fr: student_fr,
                student_ch: student_ch,
                student_education_select: req.body.student_education_select,
                student_character: req.body.student_character,
                student_resident_country: resident_country,
                student_point_interest: req.body.student_point_interest,
                student_addr_resident: req.body.student_addr_resident,
                student_remark: req.body.student_remark,
                guarder_name: req.body.guarder_name,
                student_relation: req.body.student_relation,
                guarder_mail: req.body.guarder_mail,
                guarder_tel: req.body.guarder_tel,
                guarder_wechat: req.body.guarder_wechat,
                guarder_facebook: req.body.guarder_facebook,
                zone_time: req.body.zone_time
            });
        });
        res.redirect('/admin/studentSign/');
        // res.send();
    });
    router.post('/controlClass/data', (req, res) => {
        var student_username = req.body.user_student;
        var teacher_username = req.body.user_teacher;
        var student_schedule = req.body.student_schedule;
        var teacher_schedule = req.body.teacher_schedule;
        var getdata_series = req.body.getdata_series;
        var getdata_level = req.body.getdata_level;
        var getdata_numclass = req.body.getdata_numclass;
        var number_ofClass = req.body.number_class;
        var channel = student_username;
        var token_student = "";
        var token_teacher = "";
        var stu_list = {};
        var tea_list = {};
        var schedule_length = student_schedule.length;
        const schedule_manager_student_schedule = schedule_manager.child("/student_schedule/");
        const schedule_manager_teacher_schedule = schedule_manager.child("/teacher_schedule/");
        const channel_userRef_classroom = userRef_classroom.child(channel);
        const courseware_userRef_classroom = channel_userRef_classroom.child("/courseware");
        for (var i = 0; i < schedule_length; i++) {
            var temp_stu = student_schedule[i];
            var temp_tea = teacher_schedule[i];
            stu_list[temp_stu] = teacher_username;
            tea_list[temp_tea] = student_username;
        }
        userRef_student_infos.child("/" + student_username + "/").once("value", snapshot => {
            channel_userRef_classroom.update({
                uid_student: snapshot.val().uid
            });
        });
        userRef_teacher_infos.child(teacher_username).once("value", snapshot => {
            channel_userRef_classroom.update({
                uid_teacher: snapshot.val().uid
            });
        });
        channel_userRef_classroom.update({
            student_user: student_username,
            teacher_user: teacher_username,

            channel: channel,
            token_student: token_student,
            token_teacher: token_teacher
        });
        courseware_userRef_classroom.update({
            number_of_class: number_ofClass,
            level: getdata_level,
            series: getdata_series,
            series_num: getdata_numclass,
            num_class: 1
        });
        channel_userRef_classroom.child("/student_scheduleTime/").update(stu_list);
        channel_userRef_classroom.child("/teacher_scheduleTime/").update(tea_list)

        schedule_manager_student_schedule.child(student_username).update(stu_list);
        schedule_manager_teacher_schedule.child(teacher_username).update(tea_list);
    });

    // schedule_manager_infos

    //console.log(student_username + "*" + teacher_username + "*" + student_schedule + "*" + teacher_schedule + "*" + number_ofClass);
    router.use('/login', require('./login')());
    // router.use('/banners', require('./banners')());
    // router.use('/custom', require('./custom')());

    return router;
};