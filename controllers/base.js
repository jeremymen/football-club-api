const User = require('../lib/user')

module.exports.create = (req, res, next) => {
  User.create(req.body)
    .then((user) => {
      res.status(202).json(user)
    })
    .catch(next)
}

module.exports.login = (req, res, next) => {
  const { email, password } = req.body

  User.login(email, password)
    .then(user => {
      req.session.user = user
      res.status(200).json(user)
    })
    .catch(next)
}

module.exports.logout = (req, res) => {
  req.session.destroy()
  res.status(204).json()
}