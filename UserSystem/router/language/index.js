const express = require('express');
const common = require('../../libs/common');
const admin = require("firebase-admin");

const database = admin.database();
const rootRef = database.ref();
const userRef_language = rootRef.child("/language/");
// const userRef_student = rootRef.child("/student/");
// const userRef_teacher = rootRef.child("/teacher/");

module.exports = function() {
    var router = express.Router();
    router.post("/language", (req, res) => {
        var language = req.body.language;
        if (language == "ch") {
            const userRef_ch = userRef_language.child("chinese");
            const userRef_ch_index = userRef_ch.child("index");
            userRef_ch_index.once("value", snapshot => {
                var data = {
                    student: snapshot.val().student,
                    teacher: snapshot.val().teacher,
                    assistant: snapshot.val().assistant,
                    tel_fr: snapshot.val().tel_fr,
                    tel_ch: snapshot.val().tel_ch,
                    coulart_aller_1: snapshot.val().coulart_aller_1,
                    coulart_aller_2: snapshot.val().coulart_aller_2
                };
                console.log(data);
                res.send(data);
            });

        } else if (language == "fr") {
            const userRef_fr = userRef_language.child("french");
            const userRef_fr_index = userRef_fr.child("index");
            userRef_fr_index.once("value", snapshot => {
                var data = {
                    student: snapshot.val().student,
                    teacher: snapshot.val().teacher,
                    assistant: snapshot.val().assistant,
                    tel_fr: snapshot.val().tel_fr,
                    tel_ch: snapshot.val().tel_ch,
                    coulart_aller_1: snapshot.val().coulart_aller_1,
                    coulart_aller_2: snapshot.val().coulart_aller_2
                };
                console.log(data);
                res.send(data);
            });
        } else if (language == "en") {
            const userRef_en = userRef_language.child("english");
            const userRef_en_index = userRef_en.child("index");
            userRef_en_index.once("value", snapshot => {
                var data = {
                    student: snapshot.val().student,
                    teacher: snapshot.val().teacher,
                    assistant: snapshot.val().assistant,
                    tel_fr: snapshot.val().tel_fr,
                    tel_ch: snapshot.val().tel_ch,
                    coulart_aller_1: snapshot.val().coulart_aller_1,
                    coulart_aller_2: snapshot.val().coulart_aller_2
                };
                console.log(data);
                res.send(data);
            });
        }
    });
    router.post("/student_login", (req, res) => {
        var language = req.body.language;
        if (language == "ch") {
            const userRef_ch = userRef_language.child("chinese");
            const userRef_ch_student_login = userRef_ch.child("student_login");
            userRef_ch_student_login.once("value", snapshot => {
                var data = {
                    email: snapshot.val().email,
                    forgot: snapshot.val().forgot,
                    login: snapshot.val().login,
                    password: snapshot.val().password,
                    title: snapshot.val().title
                };
                console.log(data);
                res.send(data);
            });

        } else if (language == "fr") {
            const userRef_fr = userRef_language.child("french");
            const userRef_fr_student_login = userRef_fr.child("student_login");
            userRef_fr_student_login.once("value", snapshot => {
                var data = {
                    email: snapshot.val().email,
                    forgot: snapshot.val().forgot,
                    login: snapshot.val().login,
                    password: snapshot.val().password,
                    title: snapshot.val().title
                };
                console.log(data);
                res.send(data);
            });
        } else if (language == "en") {
            const userRef_en = userRef_language.child("english");
            const userRef_en_student_login = userRef_en.child("student_login");
            userRef_en_student_login.once("value", snapshot => {
                var data = {
                    email: snapshot.val().email,
                    forgot: snapshot.val().forgot,
                    login: snapshot.val().login,
                    password: snapshot.val().password,
                    title: snapshot.val().title
                };
                console.log(data);
                res.send(data);
            });
        }
    });
    router.post("/teacher_login", (req, res) => {
        var language = req.body.language;
        if (language == "ch") {
            const userRef_ch = userRef_language.child("chinese");
            const userRef_ch_teacher_login = userRef_ch.child("teacher_login");
            userRef_ch_teacher_login.once("value", snapshot => {
                var data = {
                    email: snapshot.val().email,
                    forgot: snapshot.val().forgot,
                    login: snapshot.val().login,
                    password: snapshot.val().password,
                    title: snapshot.val().title
                };
                console.log(data);
                res.send(data);
            });

        } else if (language == "fr") {
            const userRef_fr = userRef_language.child("french");
            const userRef_fr_teacher_login = userRef_fr.child("teacher_login");
            userRef_fr_teacher_login.once("value", snapshot => {
                var data = {
                    email: snapshot.val().email,
                    forgot: snapshot.val().forgot,
                    login: snapshot.val().login,
                    password: snapshot.val().password,
                    title: snapshot.val().title
                };
                console.log(data);
                res.send(data);
            });
        } else if (language == "en") {
            const userRef_en = userRef_language.child("english");
            const userRef_en_teacher_login = userRef_en.child("teacher_login");
            userRef_en_teacher_login.once("value", snapshot => {
                var data = {
                    email: snapshot.val().email,
                    forgot: snapshot.val().forgot,
                    login: snapshot.val().login,
                    password: snapshot.val().password,
                    title: snapshot.val().title
                };
                console.log(data);
                res.send(data);
            });
        }
    });
    router.post("/student_index", (req, res) => {
        var language = req.body.language;
        if (language == "ch") {
            const userRef_ch = userRef_language.child("chinese");
            const userRef_ch_student_login = userRef_ch.child("student_index");
            userRef_ch_student_login.once("value", snapshot => {
                var data = {
                    my_profil_student: snapshot.val().my_profil_student,
                    my_art_pass: snapshot.val().my_art_pass,
                    my_class: snapshot.val().my_class,
                    my_class_manager: snapshot.val().my_class_manager,
                    my_class_preview: snapshot.val().my_class_preview,
                    my_class_type_official: snapshot.val().my_class_type_official,
                    my_inform: snapshot.val().my_inform,
                    my_next_class: snapshot.val().my_next_class,
                    my_vacate: snapshot.val().my_vacate,
                    not_on_time: snapshot.val().not_on_time
                };
                console.log(data);
                res.send(data);
            });

        } else if (language == "fr") {
            const userRef_fr = userRef_language.child("french");
            const userRef_fr_student_login = userRef_fr.child("student_index");
            userRef_fr_student_login.once("value", snapshot => {
                var data = {
                    my_profil_student: snapshot.val().my_profil_student,
                    my_art_pass: snapshot.val().my_art_pass,
                    my_class: snapshot.val().my_class,
                    my_class_manager: snapshot.val().my_class_manager,
                    my_class_preview: snapshot.val().my_class_preview,
                    my_class_type_official: snapshot.val().my_class_type_official,
                    my_inform: snapshot.val().my_inform,
                    my_next_class: snapshot.val().my_next_class,
                    my_vacate: snapshot.val().my_vacate,
                    not_on_time: snapshot.val().not_on_time
                };
                console.log(data);
                res.send(data);
            });
        } else if (language == "en") {
            const userRef_en = userRef_language.child("english");
            const userRef_en_student_login = userRef_en.child("student_index");
            userRef_en_student_login.once("value", snapshot => {
                var data = {
                    my_profil_student: snapshot.val().my_profil_student,
                    my_art_pass: snapshot.val().my_art_pass,
                    my_class: snapshot.val().my_class,
                    my_class_manager: snapshot.val().my_class_manager,
                    my_class_preview: snapshot.val().my_class_preview,
                    my_class_type_official: snapshot.val().my_class_type_official,
                    my_inform: snapshot.val().my_inform,
                    my_next_class: snapshot.val().my_next_class,
                    my_vacate: snapshot.val().my_vacate,
                    not_on_time: snapshot.val().not_on_time
                };
                console.log(data);
                res.send(data);
            });
        }
    });
    router.post("/teacher_index", (req, res) => {
        var language = req.body.language;
        if (language == "ch") {
            const userRef_ch = userRef_language.child("chinese");
            const userRef_ch_teacher_login = userRef_ch.child("teacher_index");
            userRef_ch_teacher_login.once("value", snapshot => {
                var data = {
                    my_class_type: snapshot.val().my_class_type,
                    my_art_path: snapshot.val().my_art_pass,
                    my_class_manager: snapshot.val().my_class_manager,
                    my_class: snapshot.val().my_class,
                    my_next_class: snapshot.val().my_next_class,
                    my_vacate: snapshot.val().my_vacate,
                    not_on_time: snapshot.val().not_on_time,
                    my_course_developement: snapshot.val().course_developement,
                    my_salary: snapshot.val().my_salary,
                    wait_for_comment: snapshot.val().wait_for_comment,
                    class_finish: snapshot.val().class_finish
                };
                console.log(data);
                res.send(data);
            });

        } else if (language == "fr") {
            const userRef_fr = userRef_language.child("french");
            const userRef_fr_teacher_login = userRef_fr.child("teacher_index");
            userRef_fr_teacher_login.once("value", snapshot => {
                var data = {
                    my_class_type: snapshot.val().my_class_type,
                    my_art_path: snapshot.val().my_art_pass,
                    my_class_manager: snapshot.val().my_class_manager,
                    my_class: snapshot.val().my_class,
                    my_next_class: snapshot.val().my_next_class,
                    my_vacate: snapshot.val().my_vacate,
                    not_on_time: snapshot.val().not_on_time,
                    my_course_developement: snapshot.val().course_developement,
                    my_salary: snapshot.val().my_salary,
                    wait_for_comment: snapshot.val().wait_for_comment,
                    class_finish: snapshot.val().class_finish
                };
                console.log(data);
                res.send(data);
            });
        } else if (language == "en") {
            const userRef_en = userRef_language.child("english");
            const userRef_en_teacher_login = userRef_en.child("teacher_index");
            userRef_en_teacher_login.once("value", snapshot => {
                var data = {
                    my_class_type: snapshot.val().my_class_type,
                    my_art_path: snapshot.val().my_art_pass,
                    my_class_manager: snapshot.val().my_class_manager,
                    my_class: snapshot.val().my_class,
                    my_next_class: snapshot.val().my_next_class,
                    my_vacate: snapshot.val().my_vacate,
                    not_on_time: snapshot.val().not_on_time,
                    my_course_developement: snapshot.val().course_developement,
                    my_salary: snapshot.val().my_salary,
                    wait_for_comment: snapshot.val().wait_for_comment,
                    class_finish: snapshot.val().class_finish
                };
                console.log(data);
                res.send(data);
            });
        }
    });
    return router;
};