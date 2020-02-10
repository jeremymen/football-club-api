const createError = require('http-errors')
const Club = require('../models/club')
const User = require('../models/user')

module.exports.isAdmin = (req, res, next) => {
  const { id }  = req.session.user
  const { username } = req.params

  User.findById(id)
    .then(user => {
      if (!user) {
        throw createError(404, 'user not found')
      } else {
        Club.findOne({ username })
          .then(club => {
            if (!club) {
              throw createError(404, 'club not found')
            } else {

              const isAdmin = club.admin.includes(id)

              if (isAdmin) {
                next()
              } else {
                throw createError(401, 'user is not authorizated')
              }
            }
          })
          .catch(next)
      }
    })
}

module.exports.isNotTheLastAdmin = (req, res, next) => {
  const { userUsername, clubUsername } = req.params

  User.findOne({ username: userUsername })
    .then(user => {
      if (!user) {
        throw createError(404, 'user not found')
      } else {
        Club.findOne({ username: clubUsername })
          .then(club => {
            const theLastAdmin = club.admin.length === 1 &&
              club.admin.includes(user.id)
            if (theLastAdmin) {
              throw createError(403, 'you are the only one admin! you cannot leave the club')
            } else {
              next()
            }
        })
      }
    })
    .catch(next)
}