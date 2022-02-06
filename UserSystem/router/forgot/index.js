const express = require('express');
const common = require('../../libs/common');
const admin = require("firebase-admin");

const database = admin.database();
const rootRef = database.ref();
const userRef_student = rootRef.child("/student/");
const userRef_teacher = rootRef.child("/teacher/");
const userRef_admin = rootRef.child("/super_admin/");

module.exports = function() {
    var router = express.Router();
    router.post("/student/change_password", (req, res) => {
        var email = req.body.forgot_email;
        var password = req.body.forgot_new_passoword;
        userRef_student.once("value", snapshot => {
            var data_length = snapshot.numChildren();
            var index = 0;
            console.log(data_length);
            snapshot.forEach(function(childSnapshot) {
                var userIndex = index + 1;
                var data_email = childSnapshot.val().email;
                if ((email == data_email)) {
                    userRef_student.child("/" + userIndex).update({
                        password: password
                    });
                    console.log("index:" + index);
                    console.log("userIndex:" + userIndex);
                    return res.redirect("/student/");
                } else {
                    console.log("now index is = " + index);
                    index++;
                }
            });
        });
    });
    router.post("/teacher/change_password", (req, res) => {
        var email = req.body.forgot_email;
        var password = req.body.forgot_new_passoword;
        userRef_teacher.once("value", snapshot => {
            var data_length = snapshot.numChildren();
            var index = 0;
            console.log(data_length);
            snapshot.forEach(function(childSnapshot) {
                var userIndex = index + 1;
                var data_email = childSnapshot.val().email;
                if ((email == data_email)) {
                    userRef_teacher.child("/" + userIndex).update({
                        password: password
                    });
                    console.log("index:" + index);
                    console.log("userIndex:" + userIndex);
                    return res.redirect("/student/");
                } else {
                    console.log("now index is = " + index);
                    index++;
                }
            });
        });
    });
    router.post("/admin/change_password", (req, res) => {
        var email = req.body.forgot_email;
        var password = req.body.forgot_new_passoword;
        userRef_admin.once("value", snapshot => {
            var data_length = snapshot.numChildren();
            var index = 0;
            console.log(data_length);
            snapshot.forEach(function(childSnapshot) {
                var userIndex = index;
                var data_email = childSnapshot.val().email;
                if ((email == data_email)) {
                    userRef_admin.child("/" + userIndex).update({
                        password: password
                    });
                    console.log("index:" + index);
                    console.log("userIndex:" + userIndex);
                    return res.redirect("/admin/");
                } else {
                    console.log("now index is = " + index);
                    index++;
                }
            });
        });
    });
    return router;
};