const User = require('../lib/user')

module.exports.getAll = (_, res, next) => {
  User.getAll()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(next)
}

module.exports.getOne = (req, res, next) => {
  const { userUsername } = req.params

  User.get(userUsername)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(next)
}

module.exports.delete = (req, res, next) => {
  const { userUsername } = req.params

  User.delete(userUsername)
    .then(user => {
      req.session.destroy()
      res.status(200).json(user)
    })
    .catch(next)
}