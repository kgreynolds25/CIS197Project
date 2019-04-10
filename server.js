var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var mongoose = require('mongoose');
var isAuthenticated = require('./middlewares/isAuthenticated.js');
var Payment = require('./models/payment.js');
var accountRouter = require('./routes/account.js');
var apiRouter = require('./routes/api.js');
var app = express();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hw5-new')

app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

app.use('/static', express.static(path.join(__dirname, 'static')))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(cookieSession({
  name: 'local-session',
  keys: ['spooky'],
  maxAge: 24 * 60 * 60 * 1000
}))

app.get('/', function (req, res, next) {
  Payment.find({}, function (err, result) {
    if (err) next(err)
    res.render('index', {
      payments: result,
      user: req.session.user.username,
      money: req.session.user.money
    })
  })
});

app.post('/', isAuthenticated, function (req, res, next) {
  const { paymentAmount, receiver } = req.body;
  const author = req.session.user.username;
  const p = new Payment({ paymentAmount, author, receiver });
  p.save(function (err, result) {
    if (err) next(err)
    res.redirect('/')
  })
})

app.use('/account', accountRouter)

app.use('/api', apiRouter)

app.use(function (err, req, res, next) {
  return res.send('ERROR :  ' + err.message)
})

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + (process.env.PORT || 3000))
})
