const User = require('../lib/user')
const Club = require('../lib/club')
const Event = require('../lib/event')
const createError = require('http-errors')


module.exports.userExist = (req, _, next) => {
  const { userUsername } = req.params

  User.getOne(userUsername)
    .then(user => {
      if (!user) {
        throw createError(404, "user not found")
      } else {
        next()
      }
    })
    .catch(next)
}

module.exports.clubExist = (req, _, next) => {
  const { clubUsername } = req.params

  Club.getOne(clubUsername)
    .then(club => {
      if (!club) {
        throw createError(404, "club not found")
      } else {
        next()
      }
    })
    .catch(next)
}