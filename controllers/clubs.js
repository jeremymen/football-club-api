const Club = require('../models/club')
const User = require('../models/user')
const createError = require('http-errors')

module.exports.create = (req, res, next) => {

  const { id } = req.session.user

  User.findById(id)
    .then(user => {
      if (user.club) {
        throw createError(403, 'user is already part of a club')
      } else {

        //set defaults values for any new club
        req.body.admin = id
        req.body.username = req.body.name.split(' ').join('')

        Club.create(req.body)
          .then(club => {
            User.findByIdAndUpdate(
              id, 
              { club: club._id }, 
              { new: true }
            )
              .then(()=> {
                res.status(202).json(club)
              })
          })
      }
    })
    .catch(next)
}

module.exports.getClubs = (_, res, next) => {
  Club.find()
    .then(clubs => {
      res.status(200).json(clubs)
    })
    .catch(next)
}

module.exports.getClub = (req, res, next) => {

  const { username } = req.params

  Club.findOne({ username })
    .then(club => {
      if (!club) {
        throw createError(404, "club not found")
      }
      res.status(200).json(club)
    })
    .catch(next)
}

module.exports.updateClub = (req, res, next) => {

  const { username } = req.params
  req.body.username = req.body.name.split(' ').join('')

  Club.findOneAndUpdate({ username }, req.body, { new: true })
    .then(club => {
      if (!club) {
        throw createError(404, "club not found")
      } else {
        res.status(200).json(club)
      }
    })
    .catch(next)
}