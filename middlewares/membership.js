const createError = require('http-errors')
const userModel = require('../models/user')
const clubModel = require('../models/club')
const ObjectId = require('mongoose').Types.ObjectId

module.exports.isMemberOfAClub = (req, res, next) => {
  const { userUsername } = req.params
  const searchingValue = ObjectId.isValid(userUsername) ?
    { _id: userUsername} : { username: userUsername }

  userModel.findOne(searchingValue)
    .then(user => {
      if (user.club) {
        next()
      } else {
        throw createError(400, 'user is not a member of any club')
      }
    })
}

module.exports.notAMemberOfAnyClub = (req, _, next) => {
  const { id } = req.session.user

  userModel.findById(id)
    .then(user => {
      if (!user.club) {
        next()
      } else {
        throw createError(403, 'user is already a member of a club')
      }
    })
    .catch(next)
}

module.exports.isMemberOfThisClub = (req, _, next) => {
  const { userUsername, clubUsername } = req.params
  const searchingValue = ObjectId.isValid(clubUsername) ?
    { _id: clubUsername} : { username: clubUsername }

  clubModel.findOne(searchingValue)
    .then(club => {
      userModel.findOne({ username: userUsername })
        .then(user => {
          if (!user.club) {
            throw createError(403, 'user is not part of any club')
          }
          const isMember = user.club.toString() === (club.id).toString()

          if (isMember) {
            next()
          } else {
            throw createError(403, "you can't unsubscribe from this club")
          }
        })
        .catch(next)
    })
}
