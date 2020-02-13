const Event = require('../lib/event')

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