const User = require('../lib/user')

module.exports.getUsers = (req, res, next) => {
  User.getAll()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(next)
}

module.exports.getUser = (req, res, next) => {
  const { username } = req.params

  User.get(username)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(next)
}

module.exports.deleteUser = (req, res, next) => {
  const { username } = req.params

  User.delete(username)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(next)
}