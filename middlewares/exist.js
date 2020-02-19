const User = require('../lib/user')
const Club = require('../lib/club')
const Event = require('../lib/event')
const createError = require('http-errors')
const ObjectId = require('mongoose').Types.ObjectId


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

module.exports.eventExist = (req, _, next) => {
  const { eventId } = req.params
  
  if (ObjectId.isValid(eventId)) {
    newEvent = new Event
  
    newEvent.getOne(eventId)
      .then(event => {
        if (!event) {
          throw createError(404, "event not found")
        }
        else {
          next()
        }
      })
      .catch(next)
  } else {
    throw createError(404, "event not found")
  }
}
