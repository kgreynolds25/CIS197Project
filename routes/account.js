const express = require('express')
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated')
const User = require('../models/user.js')

router.get('/signup', function (req, res) {
  res.render('signup')
})

router.post('/signup', function (req, res, next) {
  const { username, password, money } = req.body;
  const u = new User({ username, password, money });
  u.save(function (err, result) {
    if (err) next(err)
    res.redirect('/account/login')
  })
})

router.get('/login', function (req, res) {
  res.render('login')
})

router.post('/login', function (req, res, next) {
  const { username, password } = req.body;
  User.findOne({ username, password }, function (err, result) {
    if (!err && result != null) {
      req.session.user = {username: result.username, money: result.money}
      res.redirect('/')
    } else {
      next(new Error('invalid credentials'))
    }
  })
})

router.get('/logout', function (req, res) {
  req.session.user = '';
  res.redirect('/')
})
/*
router.get('/logout', isAuthenticated, function (req, res) {
  req.session.user = '';
  res.redirect('/')
})*/

module.exports = router;
