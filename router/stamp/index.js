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
  var token  = req.body.token;
  // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token,'secret' ,(err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    // if token is valid, it will respond with its info
    const respond = (token) => {
    var searchQuery = connection.query('select * from user where ID = ?',[token.data],function(err,rows){
      if(err)
      {
        console.log(err)
        res.json({"status":"error"})
      }
      else {
        res.json({"number":rows[0].totalstamp , "statue":"ok"})

      }
    })

    }

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
    res.json({"status":"error"})
    }

    // process the promise
    p.then(respond).catch(onError)

})


module.exports = router;
