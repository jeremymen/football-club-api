const User = require('../lib/user')

module.exports.validate = (req, res, next) => {
  const { validationToken } = req.params

  User.validate(validationToken)
    .then(user => res.status(200).json(user))
    .catch(next)
}

module.exports.update = (req, res, next) => {
  const { userUsername } = req.params
  const user = {
    fullName: req.body.fullName,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    profilePicture: req.file ? req.file.url : undefined
  }
  
  User.update(user, userUsername)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(next)
}

module.exports.getAll = (_, res, next) => {
  User.getAll()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(next)
}

module.exports.getOne = (req, res, next) => {
  const { userUsername } = req.params

  User.getOne(userUsername)
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