const createError = require('http-errors')
const clubModel = require('../models/club')
const userModel = require('../models/user')
const ObjectId = require('mongoose').Types.ObjectId


module.exports.isAdmin = (req, _, next) => {
  const { id }  = req.session.user
  const { clubUsername } = req.params

  userModel.findById(id)
    .then(user => {
      if (!user) {
        throw createError(404, 'user not found')
      } else {
        clubModel.findOne({ username: clubUsername })
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
    })
}

module.exports.isNotAdmin = (req, _, next) => {
  const { userUsername } = req.params
  const searchingValue = ObjectId.isValid(userUsername) ?
    { _id: userUsername} : { username: userUsername }

  userModel.findOne(searchingValue)
    .then(user => {
      if (!user.club) {
        next()
      } else {
        club.findById(user.club)
          .then(club => {
            const isAdmin = club.admin.includes(id)

            if (!isAdmin) {
              next()
            } else {
              throw createError(401, 'user is an admin')
            }
          })
      }
    })
}

module.exports.isNotTheLastAdmin = (req, res, next) => {
  const { userUsername } = req.params
  const searchingValue = ObjectId.isValid(userUsername) ?
    { _id: userUsername} : { username: userUsername }

  userModel.findOne(searchingValue)
    .then(user => {
      clubModel.findById(user.club)
        .then(club => {
          if(!user.club) {
            next()
          } else {
            const istheLastAdmin = club.admin.length === 1 &&
              club.admin.includes(user.id)
  
            if (istheLastAdmin) {
              throw createError(403, 'you are the only one admin of your club!')
            } else {
              next()
            }
          }
        })
        .catch(next)
    })
    .catch(next)
}