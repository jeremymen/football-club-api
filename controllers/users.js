const User = require('../models/user')
const createError = require('http-errors')


module.exports.create = (req, res, next) => {
  User.create(req.body)
    .then((user) => {
      res.status(202).json(user)
    })
    .catch(next)
}

module.exports.login = (req, res, next) => {
  const { email, password } = req.body

  User.findOne({email})
    .then(user => {
      if(!user) {
        throw createError(404, 'user not found')
      } else {
        user.checkPassword(password)
          .then(match => {
            if (!match) {
              throw createError(400, 'invalid password')
            } else {
              req.session.user = user;
              res.status(200).json(user)
            }
          })
      }
    })
    .catch(next)
}

module.exports.logout = (req, res) => {
  req.session.destroy()
  res.status(204).json()
}