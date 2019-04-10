var express = require('express')
var router = express.Router();
var Payment = require('../models/payment.js')

//might need to fix the res.json() part. before I had result.paymentAmount but
// I don't think that was right
router.get('/getPayments', function (req, res, next) {
  Payment.find({}, function (err, result) {
    if (err) next(err)
    res.json(result.paymentAmount)
  })
})

router.post('/addPayment', function (req, res, next) {
  const { paymentAmount, receiver } = req.body;
  const author = req.session.user.username;
  const p = new Payment({ paymentAmount, author, receiver })
  p.save(function (err, result) {
    if (err) next(err)
    res.json({ status: 'OK'})
  })
})

module.exports = router;
