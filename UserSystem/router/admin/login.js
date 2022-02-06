const express = require('express');
const common = require('../../libs/common');
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
// var serviceAccount = require("./../../libs/user-class-coulartlab-firebase-adminsdk-feyfg-eba6030525.json");
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://user-class-coulartlab.firebaseio.com"
// });
const database = admin.database();
const rootRef = database.ref();
const userRef = rootRef.child("/super_admin/");

module.exports = function() {
    var router = express.Router();

    router.get('/', (req, res) => {
        router.use(express.json());
        res.render('admin/login.ejs', {});
    });

    router.post("/", (req, res) => {
        var email = req.body.email;
        var password = req.body.password;
        userRef.once("value", snapshot => {
            var data_length = snapshot.numChildren();
            var index = 0;
            console.log("index = " + index);
            console.log(data_length);
            snapshot.forEach(function(childSnapshot) {
                var data_email = childSnapshot.val().email;
                var data_password = childSnapshot.val().password;
                var data_user = childSnapshot.val().user;
                if ((email == data_email) && (password == data_password)) {
                    req.session['admin_id'] = data_user;
                    return res.redirect("/admin/");
                } else if (index == data_length - 1) {
                    res.status(400).send('password or email is incorrect');
                } else {
                    index++;
                }
            });
        });
    });
    return router;
};