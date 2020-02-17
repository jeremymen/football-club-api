const Event = require('../lib/event')
const User = require('../lib/user')
const ObjectId = require('mongoose').Types.ObjectId

module.exports.create = (req, res, next) => {
  const { body } = req
  const { id } = req.session.user
  const { clubUsername } = req.params

  newEvent = new Event

  newEvent.create(body, clubUsername, id)
    .then(event => {
      res.status(200).json(event)
    })
    .catch(next)
}

module.exports.getAll = (_, res, next) => {
  newEvent = new Event

  newEvent.getAll()
    .then(events => {
      res.status(200).json(events)
    })
    .catch(next)
}

module.exports.getOne = (req, res, next) => {
  const { eventId } = req.params
  newEvent = new Event

  newEvent.getOne(eventId)
    .then(event => {
      res.status(200).json(event)
    })
    .catch(next)
}

module.exports.getClubEvents = (req, res, next) => {
  const { clubUsername } = req.params
  const searchingValue = ObjectId.isValid(clubUsername) ?
    { _id: clubUsername} : { username: clubUsername }

  newEvent = new Event
  
  newEvent.getClubEvents(searchingValue)
    .then(events => {
      res.status(200).json(events)
    })
    .catch(next)
}

module.exports.participate = (req, res, next) => {
  const { userUsername, eventId } = req.params

  newEvent = new Event

  User.getOne(userUsername)
    .then(user => {
      newEvent.getOne(eventId)
        .then(event => {
          if (event.participants.includes(user.id)) {
            return newEvent.removeAMember(event.id, user.username)
              .then(event => {
                res.status(200).json(event)
              })
          } else {
            return newEvent.addAMember(event.id, user.id)
              .then(event => {
                res.status(200).json(event)
              })
          }
        })
        .catch(next)
    })
    .catch(next)
}

module.exports.delete = (req, res, next) => {
  const { eventId } = req.params

  newEvent = new Event

  newEvent.delete(eventId)
    .then(event => {
      res.status(200).json(event)
    })
    .catch(next)
}
