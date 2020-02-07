const createError = require('http-errors')

module.exports.isAuthenticated = (req, _, next) => {
  if (req.session.user) {
    next()
  } else {
    next(createError(401, 'you need to login first'))
  }
}

module.exports.isNotAuthenticated = (req, _, next) => {
  if (req.session.user) {
    next(createError(403, 'you are already logged in'))
  } else {
    next()
  }
}