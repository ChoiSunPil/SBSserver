var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
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
router.get('/id',function(req,res){
var user_email = req.body.email;
var findQurey = connection.query('select * from user where email=?',[user_email],function(err,rows){
if(err)throw err;
if(rows.length>0)
{
  var mailOption = {
    from : 'roung4119@gmail.com',
    to : user_email,
    subject : '찍어썸 아이디 안내',
    text : rows[0].ID
};
transporter.sendMail(mailOption, function(err, info) {
    if ( err ) {
        console.error('Send Mail error : ', err);
    }
    else {
        console.log('Message sent : ', info);
    }
});
res.json("{'status':'ok'}");
}
else {
  res.json("{'status':'error'}");
}



})

})
router.get('/password',function(req,res){

})
router.get('/auth',function(req,res){

})
router.get('/check',function(req,res){

})



module.exports = router;
