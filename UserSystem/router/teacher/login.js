const express = require('express');
const common = require('../../libs/common');
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const database = admin.database();
const rootRef = database.ref();
const userRef_teacher = rootRef.child("/teacher/");
const userRef_language = rootRef.child("language");
//const userRef = rootRef.child("/teacher/");

module.exports = function() {
    var router = express.Router();

    router.get('/', (req, res) => {
        console.log("login teacher");
        // let query = geturl.parse(req.url, true).query;
        // console.log("student login");
        // let lang = query.lang;
        // console.log(lang);
        router.use(express.json());
        res.render('teacher/login.ejs');
    });

    router.post("/", (req, res) => {
        var email = req.body.email;
        var password = req.body.password;
        userRef_teacher.once("value", snapshot => {
            var data_length = snapshot.numChildren();
            var index = 0;
            console.log("index = " + index);
            console.log(data_length);
            snapshot.forEach(function(childSnapshot) {
                var data_email = childSnapshot.val().email;
                var data_password = childSnapshot.val().password;
                var data_user = childSnapshot.val().user;
                if ((email == data_email) && (password == data_password)) {
                    req.session['teacher_id'] = data_user;
                    return res.redirect("/teacher/");
                } else if (index == data_length - 1) {
                    res.status(400).send('password or email is incorrect');
                    console.log("email:" + email + "data_email" + data_email + "password" + password + "data_password" + data_password);
                    console.log("final index is = " + index);
                } else {
                    index++;
                }
            });
        });
    });
    return router;
};