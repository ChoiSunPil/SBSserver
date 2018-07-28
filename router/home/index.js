var express = require('express')
var mysql = require('mysql')
var router = express.Router()
var path = require('path')
var jwt = require('jsonwebtoken');
var connection = mysql.createConnection({
  host : 'localhost',
  port : '3306',
  user : 'root',
  password : 'Choi6459@@',
  database : 'seouldb'
})
connection.connect();
router.get('/',function(req, res){
console.log(req.body.token)
var decoded = jwt.verify(req.body.token, 'shhhhh');
// jwt.verify(req.body.token, 'shhhhh', function(err, decoded) {
//   if (err) {
//     /*
//       err = {
//         name: 'JsonWebTokenError',
//         message: 'jwt malformed'
//       }
//     */
//   }
// });
console.log(decoded.foo) // bar
res.end();
})


module.exports = router;
