const createError = require('http-errors')
const clubModel = require('../models/club')
const ObjectId = require('mongoose').Types.ObjectId

module.exports.exist = (req, res, next) => {
  const { clubUsername } = req.params
  const searchingValue = ObjectId.isValid(clubUsername) ?
    { _id: clubUsername} : { username: clubUsername }

  clubModel.findOne(searchingValue)
    .then(club => {
      if (!club) {
        throw createError(404, "club not found")
      } else {
        next()
      }
    })
    .catch(next)
}