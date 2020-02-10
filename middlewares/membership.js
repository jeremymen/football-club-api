const createError = require('http-errors')
const User = require('../models/user')
const Club = require('../models/club')

module.exports.notAMemberOfAnyClub = (req, _, next) => {
  const { id } = req.session.user

  User.findById(id)
    .then(user => {
      if (!user.club) {
        next()
      } else {
        throw createError(403, 'user is already a member of a club')
      }
    })
    .catch(next)
}

module.exports.isFromThisClub = (req, res, next) => {
  const { userUsername, clubUsername } = req.params
  
  Club.findOne({ username: clubUsername })
    .then(club => {
      User.findOne({ username: userUsername })
        .then(user => {
          if (user.club == club.id) {
            next()
          } else {
            throw createError(403, "you can't unsubscribe from this club")
          }
        })
        .catch(next)
    })
}
