const User = require('../lib/user')

module.exports.getUsers = (_, res, next) => {
  User.getAll()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(next)
}

module.exports.getUser = (req, res, next) => {
  const { userUsername } = req.params

  User.get(userUsername)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(next)
}

module.exports.deleteUser = (req, res, next) => {
  const { userUsername } = req.params

  User.delete(userUsername)
    .then(user => {
      req.session.destroy()
      res.status(200).json(user)
    })
    .catch(next)
}