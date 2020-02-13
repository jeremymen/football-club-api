const User = require('../lib/user')
const Club = require('../lib/club')
const createError = require('http-errors')

module.exports.isMemberOfAClub = (req, _, next) => {
  const { userUsername } = req.params

  User.getOne(userUsername) 
    .then(user => {
      if (user.club) {
        next()
      } else {
        throw createError(400, 'user is not a member of any club')
      }
    })
    .catch(next)
}

module.exports.notAMemberOfAnyClub = (req, _, next) => {
  const { id } = req.session.user

  User.getOne(id)
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
  const { clubUsername, userUsername } = req.params

  Club.getOne(clubUsername)
    .then(club => {
      return User.getOne(userUsername)
        .then(user => {
          if (!user.club) {
            throw createError(403, 'user is not part of any club')
          }
          const isMember = user.club.toString() === (club.id). toString()

          if (isMember) {
            next()
          } else {
            throw createError(403, "user is not authorizated")
          }
        })
    })
    .catch(next)
}