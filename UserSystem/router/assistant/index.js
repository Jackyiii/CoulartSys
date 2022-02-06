const express=require('express');
const common=require('../../libs/common');

const admin = require("firebase-admin");
// var serviceAccount = require("./../../libs/user-class-coulartlab-firebase-adminsdk-feyfg-eba6030525.json");
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://user-class-coulartlab.firebaseio.com"
// });
const database = admin.database();
const rootRef=database.ref();
const userRef_teacher = rootRef.child("/assistant/");

module.exports=function (){
  var router=express.Router();

  //检查登录状态
  router.use((req, res, next)=>{
    if(!req.session['assistant_id'] && req.url!='/login'){ //没有登录
      res.redirect('/assistant/login');
    }else{
      next();
    }
  });

  router.get('/', (req, res)=>{
    var current_user=req.session['assistant_id'].toString();
    const userRef_teacher_infos = rootRef.child("/assistant_infos/"+current_user);
    //res.render('teacher/index.ejs', {id:req.session['teacher_id']});
    userRef_teacher_infos.once("value", snapshot =>{
      var data=JSON.stringify(snapshot.val());
      
      //var data =snapshot.val()[1].email;
      console.log(req.session['assistant_id']+"/ data is :"+data);
      res.render('assistant/index.ejs', {id:data});
    });
  });
  router.use('/login', require('./login')());
  // router.use('/banners', require('./banners')());
  // router.use('/custom', require('./custom')());

  return router;
};
