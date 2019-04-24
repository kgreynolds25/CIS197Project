const express = require('express')
const router = express.Router();
const Payment = require('../models/payment.js')
const User = require('../models/user.js')

router.get('/getPayments', function (req, res, next) {
  ps = Payment.find({}, function (err, result) {
    if (err) return next(err)
    res.json(result.paymentAmount)
  })
})

router.post('/addPayment', function (req, res, next) {
  const { paymentAmount, receiver } = req.body;
  const author = req.session.user.username;
  const money = req.session.user.money;
  if (money >= paymentAmount && paymentAmount >= 0) {
    User.findOne({ username: author }, function (err, u) {
      if (err) return next(err);
      u.money = Number(money) - Number(paymentAmount);
      u.save(function (saveErr, result) {
        if (saveErr) return next(saveErr);
        req.session.user = result;
        const p = new Payment({ paymentAmount, author, receiver });
        p.save(function (err, result) {
          if (err) return next(err);
          res.json(u);
        })
      });
    });
  } else {
    next(new Error('you do not have enough money in your account'));
  }
})

router.post('/addMoney', function (req, res, next) {
  const moneyAdded = req.body.moneyAdded;
  const { username, money } = req.session.user;
  if (moneyAdded >= 0) {
    User.findOne({ username }, function (err, u) {
      if (err) return next(err);
      u.money = Number(money) + Number(moneyAdded);
      u.save(function (saveErr, result) {
        if (saveErr) return next(saveErr);
        req.session.user = result;
        res.json({status: 'OK'});
      });
    });
  } else {
    next(new Error('invalid amount'));
  }
})

module.exports = router;
