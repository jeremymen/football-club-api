const Club = require('../lib/club')
const User = require('../lib/user')

module.exports.create = (req, res, next) => {
  const { body } = req
  const userId = req.session.user.id

  const user = {
    name: body.name,
    teamCountry: body.teamCountry,
    teamLeague: body.teamLeague,
    team: body.team,
    isOfficialClub: body.isOfficialClub,
    city: body.city,
    address: body.address,
    description: body.description,
    emblem: req.file ? req.file.secure_url : undefined
  }

  Club.create(user, userId)
    .then(club => {
      res.status(200).json(club)
    })
    .catch(next)
}

module.exports.getAll = (_, res, next) => {
  Club.getAll()
    .then(clubs => {
      res.status(200).json(clubs)
    })
    .catch(next)
}

module.exports.getOne = (req, res, next) => {
  const { clubUsername } = req.params

  Club.getOne(clubUsername)
    .then(club => {
      res.status(200).json(club)
    })
    .catch(next)
}

module.exports.update = (req, res, next) => {
  const { clubUsername } = req.params

  Club.getOne(clubUsername)
    .then(club => {

      const body = {
        name: req.body.name ? req.body.name : club.name,
        city: req.body.city ? req.body.city : club.city,
        address: req.body.address ? req.body.address : club.address,
        emblem: req.file ? req.file.secure_url : club.emblem
      }
      
      Club.update(body, clubUsername)
        .then(club => {
          res.status(200).json(club)
        })
        .catch(next)
    })
    .catch(next)
}


module.exports.getUsers = (req, res, next) => {
  const { clubUsername } = req.params
  
  Club.getAllUsers(clubUsername)
  .then(users => {
    res.status(200).json(users)
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

module.exports.unsubscribe = (req, res, next) => {
  const userId = req.session.user.id
  const { clubUsername, userUsername } = req.params
  
  User.removeAsMember(userId, userUsername, clubUsername)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(next)
}

module.exports.delete = (req, res, next) => {
  const { clubUsername } = req.params

  Promise.resolve(Club.getAllUsers(clubUsername))
    .then(users => {
      return Club.removeManyUsers(users)  
        .then(() => {
          return Club.delete(clubUsername)
            .then(club => {
              res.status(200).json(club)
            })
        })
    })
    .catch(next)
}