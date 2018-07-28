var express = require('express')
var router = express.Router();
var path = require('path')
var register = require('./register/index')
var login = require('./login/index')
var home = require('./home/index')
var find  = require('./find/index')
// var facebook  = require('./login/facebook')
router.use('/login',login)
router.use('/register',register)
router.use('/home',home)
router.use('/find',find)
// router.use('/facebook',facebook)
module.exports = router;
