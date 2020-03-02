const User = require('../lib/user')

module.exports.validate = (req, res, next) => {
  const { validationToken } = req.params

  User.validate(validationToken)
    .then(user => res.status(200).json(user))
    .catch(next)
}

module.exports.update = (req, res, next) => {
  const { userUsername } = req.params
  User.getOne(userUsername) 
    .then(user => {
      const body = {
        fullName: req.body.fullName,
        password: req.body.password ? req.body.password : user.password,
        profilePicture: req.file ? req.file.secure_url : user.profilePicture
      }

      User.update(body, userUsername)
        .then(user => {
          res.status(200).json(user)
        })
        .catch(next)
    })
  
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