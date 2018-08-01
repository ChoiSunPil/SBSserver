var express = require('express')
var router = express.Router()
var sleep = require('sleep')
var mysql = require('mysql')
var rn = require('random-number');
var nodemailer = require('nodemailer');
var count = 0;
var user_email
var gen = rn.generator({
  min:  100000
, max:  999999
, integer: true
})
let transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user : 'roung4119@gmail.com',
        pass : 'choi6459'
    }
});
var connection = mysql.createConnection({
  host : 'localhost',
  port : '3306',
  user : 'root',
  password : 'Choi6459@@',
  database : 'seouldb'
})
router.rmAuth = function (user_email){
    var deleQuery = connection.query('delete  from find_pw where email=?',[user_email],function(err,rows){
      if(err){
		console.log(err);
	} else {
		console.log(rows);
	}
})
}
//이메일로 인증번호 6자리 보냄
router.post('/',function(req,res){
//var user_id = req.query.id;
 user_email = req.body.email;
var auth_number =  gen();
var mailOption = {
  from : 'roung4119@gmail.com',
  to : user_email,
  subject : '찍어썸 인증번호 안내',
  text : auth_number+""
};
transporter.sendMail(mailOption, function(err, info) {
  console.log("sendMail"+count++);
  if ( err ) {
      console.error('Send Mail error : ', err);
  }
  else {
      console.log('Message sent : ', info);
  }
});
//해당 이메일 있는지

var findQurey = connection.query('select * from user where email=?',[user_email],function(err,rows){
    console.log("findQuery"+count++);
if(err)throw err;
if(rows.length > 0)
{
//DB에 추가
var insertquery = connection.query('insert into find_pw values(?,?,?);',["0",user_email,auth_number],function(err,rows){
  console.log("insertquery"+count++);
if(err){
console.log(err);
}
//pk = rows;
console.log("insert")
console.log(user_email+"  "+auth_number)

})
res.json('{"status":"ok"}');
}
else {
  res.json('{"status":"error"}');
}
})
})
module.exports = router;
