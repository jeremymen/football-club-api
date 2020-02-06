const User = require('../models/user')

module.exports.create = (req, res, next) => {
  User.create(req.body)
    .then(() => {
      res.status(202).json({message: 'user created'})
    })
    .catch(next)
}

module.exports.login = (req, res, next) => {

}