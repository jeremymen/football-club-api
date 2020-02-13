const Club = require('../lib/club')
const User = require('../lib/user')
const createError = require('http-errors')

module.exports.create = (req, res, next) => {
  const { body } = req
  const userId = req.session.user.id

  Club.createAsAdmin(body, userId)
    .then(club => {
      res.status(200).json(club)
    })
    .catch(next)
}

module.exports.getAll = (_, res, next) => {
  Club.getAll()
    .then(clubs => {
      res.status(200).json(clubs)
    })
    .catch(next)
}

module.exports.getOne = (req, res, next) => {
  const { clubUsername } = req.params

  Club.get(clubUsername)
    .then(club => {
      res.status(200).json(club)
    })
    .catch(next)
}

module.exports.update = (req, res, next) => {
  const { clubUsername } = req.params
  const { body } = req
  
  Club.update(body, clubUsername)
    .then(club => {
      res.status(200).json(club)
    })
    .catch(next)
}

module.exports.getUsers = (req, res, next) => {
  const { clubUsername } = req.params

  Club.getAllUsers(clubUsername)
    .then(users => {
      res.status(200).json(users)
    })
    .catch(next)
}

module.exports.subscribe = (req, res, next) => {
  const userId = req.session.user.id
  const { clubUsername } = req.params
  
  User.addAsMember(userId, clubUsername)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(next)
}

module.exports.unsubscribe = (req, res, next) => {
  const userId = req.session.user.id
  const { clubUsername, userUsername } = req.params

  User.removeAsMember(userId, userUsername, clubUsername)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(next)
}