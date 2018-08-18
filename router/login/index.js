var express = require('express')
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);
var router = express.Router();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var jwt = require('jsonwebtoken');
var mysql = require('mysql')
var path = require('path')
var connection = mysql.createConnection({
  host : 'localhost',
  port : '3306',
  user : 'root',
  password : 'Choi6459@@',
  database : 'seouldb'
})
connection.connect();
router.post('/',function(req,res){
var id = req.body.ID
var password = req.body.password
var searchQuery = connection.query('select * from user where ID = ?',[id],function(err,rows){
  if(err)throw err
  if(rows.length < 1)
  {
    var msg = {"status": "ID_ERROR"}
    res.json(msg)
    return;
  }
  else {
    console.log(rows[0].password);
    if(rows[0].password === password){
     //토큰 값 DB저장 및 보내기
     var token =jwt.sign({
       data: id
     }, 'secret', { expiresIn: '1h' });
     console.log(token);
     //var token = tokenHelper.tokenGenerator();
     var name = rows[0].name;
     var type = rows[0].type;
     var email = rows[0].email;
     var respone = {'status':'ok','token':token,'name':name,'type':type,'email':email}
     res.json(respone);
    return;
    }
    else {
      var msg = {"status": "PW_ERROR"}
      res.json(msg)
      return;
    }
  }
})
})




module.exports = router;
// var options = {
//   host : 'localhost',
//   port : 3306,
//   user : 'root',
//   password : 'Choi6459@@',
//   database : 'SBSbase'
// }
// var sessionStore = new MySQLStore(options);
// app.use(session({
//   key: 'session_cookie_name',
//   secret: 'session_cookie_secret',
//   resave: false, //재접속시 세션값 새로 발급 X
//   saveUninitialized : true, //세션 아이디를 세션을 실제로 사용하기 전까 발급하지 마라
//   store: sessionStore
//   }));
//
// router.use(passport.initialize());
// router.use(passport.session());
// passport.serializeUser(function(user, done){
//   console.log('serializeUser',user);
//   done(null,user.ID);
// });
// passport.deserializeUser(function(id,done){
//   console.log('deserializeUser',user);
//   var sql = 'SELECT * FROM user WHERE ID=?';
//   connection.query(sql, [id], function(err, rows){
//     console.log(sql, err, results);
//     if(err){
//       done('There is no user')
//     }
//     else {
//       done(null,rows[0]);
//     }
//   })
// })
//
// passport.use(new LocalStrategy(
//   function(username, password, done){
//     var uname = username;
//     var pwd = password;
//     var sql ='SELECT * FROM user WHERE ID =?';
//     connection.query(sql,[uname],function(err,rows){
//       if(err){
//         return done('There is no user.');
//       }
//       var user = rows[0];
//       return hasher({password:pwd},function(err, pass,hash){
//         if(hash === user.password){
//           console.log('LocalStrategy',user);
//           done(null,user);
//         }
//         else {
//           done(null, false);
//         }
//       });
//
//     });
//
//
//   }
// ));
// app.post('/', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) res.status(500).json(err);
//     if (!user) { return res.status(401).json(info.message); }
//
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       return res.json(user);
//     });
//   })(req, res, next);
// });
