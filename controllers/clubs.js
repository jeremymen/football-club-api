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

module.exports.getClubs = (_, res, next) => {
  Club.getAll()
    .then(clubs => {
      res.status(200).json(clubs)
    })
    .catch(next)
}

module.exports.getClub = (req, res, next) => {
  const { username } = req.params

  Club.get(username)
    .then(club => {
      res.status(200).json(club)
    })
    .catch(next)
}

module.exports.updateClub = (req, res, next) => {
  const { username } = req.params
  const { body } = req
  
  Club.update(body, username)
    .then(club => {
      res.status(200).json(club)
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

// module.exports.subscribe = (req, res, next) => {
//   const { userUsername, clubUsername } = req.params

//   User.findOne({ username: userUsername })
//     .then(user => {
//       Club.findOne({ username: clubUsername })
//         .then(club => {
//           if (user.club) {
//             throw createError(403, 'user is already a member of a club')
//           } else {
//             User.findByIdAndUpdate(user.id, { club: club.id }, { new: true })
//               .then(user => {
//                 res.status(200).json(user)
//               })
//           }
//         })
//         .catch(next)
//     })
//     .catch(next)
// }

module.exports.unsubscribe = (req, res, next) => {
  const userId = req.session.user.id
  const { clubUsername } = req.params

  User.removeAsMember(userId, clubUsername)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(next)
}