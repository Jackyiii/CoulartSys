const express = require('express');
const static = require('express-static');
const bodyParser = require('body-parser');
const multer = require('multer');
const multerObj = multer({ dest: './static/upload' });
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate = require('consolidate');
const expressRoute = require('express-route');
var serviceAccount = require("./libs/user-class-coulartlab-firebase-adminsdk-feyfg-eba6030525.json");
const admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://user-class-coulartlab.firebaseio.com"
});
const session_time = 20 * 60 * 1000;
const app = express();
const port = process.env.PORT || 8080;
const cookie_duetime = 100000;
app.use(express.json());
app.use(express.static("static"));
console.log("app launche 192.168.1.15: " + port);
//1.获取请求数据get data post 
app.use(bodyParser.urlencoded());
app.use(multerObj.any());
//2.cookie、session
app.use(cookieParser());
(function() {
    var keys = [];
    for (var i = 0; i < cookie_duetime; i++) {
        keys[i] = 'a_' + Math.random();
    }
    app.use(cookieSession({
        name: 'sess_id',
        keys: keys,
        maxAge: session_time //20min
    }));
})();

//render page
app.get("/", (req, res) => {
    res.send("index");
    // res.writeHead(200, {
    //     'Content-Type': 'text/plain',
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
    // });
});
//3.模板
app.engine('html', consolidate.ejs);
app.set('views', 'template');
app.set('view engine', 'ejs');
//4.router
app.use('/student', require('./router/student')());
app.use('/admin', require('./router/admin')());
app.use('/teacher', require('./router/teacher')());
app.use('/assistant', require('./router/assistant')());
app.use('/class', require('./router/class')());
app.use('/language', require('./router/language')());
app.use('/forgot', require('./router/forgot')());
//5.default：static
//app.use(static('./static/'));
app.listen(port);
//6.render page

// const database = admin.database();
// const rootRef = database.ref();
// const userRef_language = rootRef.child("/language/");
// const userRef_student = rootRef.child("/student/");
// const userRef_teacher = rootRef.child("/teacher/");
// app.post("/forgot/student/change_pa;ssword", (req, res) => {
//     var email = req.body.forgot_email;
//     var password = req.body.forgot_new_passoword;
//     userRef_student.once("value", snapshot => {
//         var data_length = snapshot.numChildren();
//         var index = 0;
//         console.log(data_length);
//         snapshot.forEach(function(childSnapshot) {
//             var userIndex = index + 1;
//             var data_email = childSnapshot.val().email;
//             if ((email == data_email)) {
//                 userRef_student.child("/" + userIndex).update({
//                     password: password
//                 });
//                 console.log("index:" + index);
//                 console.log("userIndex:" + userIndex);
//                 return res.redirect("/student/");
//             } else {
//                 console.log("now index is = " + index);
//                 index++;
//             }
//         });
//     });
// });
// app.post("/forgot/teacher/change_password", (req, res) => {
//     var email = req.body.forgot_email;
//     var password = req.body.forgot_new_passoword;
//     userRef_teacher.once("value", snapshot => {
//         var data_length = snapshot.numChildren();
//         var index = 0;
//         console.log(data_length);
//         snapshot.forEach(function(childSnapshot) {
//             var userIndex = index + 1;
//             var data_email = childSnapshot.val().email;
//             if ((email == data_email)) {
//                 userRef_teacher.child("/" + userIndex).update({
//                     password: password
//                 });
//                 console.log("index:" + index);
//                 console.log("userIndex:" + userIndex);
//                 return res.redirect("/student/");
//             } else {
//                 console.log("now index is = " + index);
//                 index++;
//             }
//         });
//     });
// });