const createError = require('http-errors')
const userModel = require('../models/user')
const ObjectId = require('mongoose').Types.ObjectId

module.exports.exist = (req, _, next) => {
  const { userUsername } = req.params
  const searchingValue = ObjectId.isValid(userUsername) ?
    { _id: userUsername} : { username: userUsername }

  userModel.findOne(searchingValue)
    .then(user => {
      if (!user) {
        throw createError(404, "user not found")
      } else {
        next()
      }
    })
    .catch(next)
}

module.exports.isCurrentUser = (req, _, next) => {
  const { id } = req.session.user
  const { userUsername }  = req.params
  const searchingValue = ObjectId.isValid(userUsername) ?
    { _id: userUsername} : { username: userUsername }

  userModel.findOne(searchingValue)
    .then(user => {
      const currentUser = id.toString() === (user.id).toString()

      if(!currentUser) {
        throw createError(401, 'user is not authorizated')
      } else {
        next()
      }
    })
    .catch(next)
}