const isAuthenticated = function (req, res, next) {
  if (req.session.user && req.session.user.length > 0) {
    next()
  } else {
    next(new Error('you are not authenticated'))
  }
}

module.exports = isAuthenticated;
