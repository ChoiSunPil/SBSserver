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
  database : 'seouldb',
  dateStrings: 'date'
})
connection.connect();

router.post('/',function(req, res){
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
        res.json({"number":rows[0].totalstamp , "status":"ok"})

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
router.post('/add',function(req,res){
  var id = req.body.ID
  var token = req.body.token
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
      console.log("serch")
      console.log(err)
      res.json({"status":"error"})
    }
    else {
      var location = rows[0].name
      var insertQuery = connection.query('insert into stamp values (?,?,?,now(),?,0)',[0,id,location,1],function(err,rows){
        if(err)
        {
          console.log("insert")
          console.log(err)
          res.json({"status":"error"})
        }
        else {

          var updateQuery = connection.query('update user SET totalstamp = totalstamp+1 WHERE ID = ?',[id],function(err,rows){
            if(err)
            {
              console.log("update")
              console.log(err)
              res.json({"status":"error"})
            }
            else{
          res.json({ "status":"ok"})
           }
          })

        }
      })
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
router.post('/used',function(req,res){

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
    var searchQuery = connection.query('select * from stamp where ID = ?',[token.data],function(err,rows){
      if(err)
      {
        console.log(err)
        res.json({"status":"error"})
      }
      else {
        var jsonArray = new Array();
        for(var i = 0 ; i < rows.length ; i++)
        {
          if(rows[i].remarks < 0)
          {
          var json = new Object();
          json.stampname = rows[i].stampname;
          json.date = rows[i].createDate;
          jsonArray.push(json);
        }
        }

       res.send(JSON.parse(JSON.stringify(jsonArray)));
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
router.post('/expired',function(req,res){
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
    var searchQuery = connection.query('select * from stamp where ID = ?',[token.data],function(err,rows){
      if(err)
      {
        console.log(err)
        res.json({"status":"error"})
      }
      else {
       var couponArray = new Array();
       var today = new Date();
        for(var i = 0 ; i < rows.length ; i++)
        {

          if(rows[i].remarks<0 && rows[i].check == 0)
          {
            var d = new Date(Date.parse(rows[i].createDate));
           if(((d.getFullYear()-today.getFullYear())*365+(3+d.getMonth() - today.getMonth())*30+(d.getDay()-today.getDay())) <30)
            couponArray.push(rows[i]);
          }
        }
       res.send(JSON.parse(JSON.stringify(couponArray)));
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
router.post('/hold',function(req,res){
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
    var searchQuery = connection.query('select * from stamp where ID = ?',[token.data],function(err,rows){
      if(err)
      {
        console.log(err)
        res.json({"status":"error"})
      }
      else {
       var couponArray = new Array();
        for(var i = 0 ; i < rows.length ; i++)
        {
          if(rows[i].remarks<0 && rows[i].check == 0)
          couponArray.push(rows[i])
        }

       res.send(JSON.parse(JSON.stringify(couponArray)));
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
router.post('/exchange',function(req,res){
var couponType = req.body.type
var couponStamp = req.body.stamp //필요 스탬프 갯수
var token = req.body.token
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
console.log(token.data)
var updateQuery = connection.query('update user SET totalstamp = totalstamp-? WHERE ID = ?',[couponStamp,token.data],function(err,rows){
  if(err)
  {
    console.log("updateErr")
    console.log(err)
    res.json({"status":"error"})
  }
  else {
    var insertQuery = connection.query('insert into stamp values(0,?,?,now(),?,0)',[token.data,couponType,-couponStamp],function(err,rows){
      if(err)
      {
        console.log("insertErr")
        console.log(err)
        res.json({"status":"error"})
      }
      else {
        res.json({"status":"ok"})
      }
    })

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




router.post('/info',function(req,res){
var searchQuery = connection.query('select * from coupon',function(err,rows){
if(err)
{
  console.log(err)
  res.json({"status":"error"})
}
else {
   res.send(JSON.parse(JSON.stringify(rows)));
}
})
})
module.exports = router;
