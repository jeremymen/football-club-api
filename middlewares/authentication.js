const createError = require('http-errors')
const User = require('../lib/user')

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

module.exports.isCurrentUser = (req, res, next) => {
  const { id } = req.session.user
  const { userUsername }  = req.params

  User.getOne(userUsername)
    .then(user => {
      const currentUser = id.toString() === (user.id).toString()

      if (!currentUser) {
        throw createError(401, 'user is not authorizated')
      } else {
        next()
      }
    })
    .catch(next)
}
