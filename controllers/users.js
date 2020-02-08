const User = require('../models/user')
const  createError = require('http-errors')

module.exports.getUsers = (req, res, next) => {
  User.find()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(next)
}

module.exports.getUser = (req, res, next) => {

  const { username } = req.params

  User.findOne({username})
    .then(user => {
      if (!user) {
        throw createError(404, "user not found")
      } else {
        res.status(200).json(user)
      }
    })
    .catch(next)
}