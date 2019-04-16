const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const isAuthenticated = require('./middlewares/isAuthenticated.js');
const Payment = require('./models/payment.js');
const accountRouter = require('./routes/account.js');
const apiRouter = require('./routes/api.js');
const app = express();
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
    if (req.session.user) {
      res.render('index', {
        payments: result,
        user: req.session.user.username,
        money: req.session.user.money
      })
    } else {
      res.render('index', {
        payments: result,
        user: req.session.user,
        money: req.session.user
      })
    }
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
