const User = require('../lib/user')
const Club = require('../lib/club')
const createError = require('http-errors')

module.exports.isAdmin = (req, _, next) => {
  const { id }  = req.session.user
  const { clubUsername } = req.params

  Club.getOne(clubUsername)
    .then(club => {
      const isAdmin = club.admin.includes(id)

      if (isAdmin) {
        next()
      } else {
        throw createError(401, 'user is not authorizated')
      }
    })
    .catch(next)
}

module.exports.isNotTheLastAdmin = (req, res, next) => {
  const { userUsername } = req.params

  User.getOne(userUsername)
    .then(user => {
      if (!user.club) {
        next()
      } 
      return Club.getOne(user.club)
        .then(club => {
          const isAdmin = club.admin.includes(user.id)
          const sigleAdmin = club.admin.length === 1
          const istheLastAdmin = isAdmin && sigleAdmin

          if (istheLastAdmin) {
            console.log('hola')
            throw createError(403, 'you are the only one admin of your club!')
          } else {
            next()
          }
        })
    })
    .catch(next)
}