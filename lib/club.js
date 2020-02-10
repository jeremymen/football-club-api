const clubModel = require('../models/club')
const userModel = require('../models/user')
const User = require('./user')
const createError = require('http-errors')

class Club {

  create(body) {
    return new Promise((resolve, reject) => {
      clubModel.create(body)
        .then(club => {
          return resolve(club)
        })
        .catch(err => {
          return reject(err)
        })
    })
  }

  createAsAdmin(body, userId) {
    return new Promise((resolve, reject) => {
      userModel.findById(userId)
        .then(user => {
          return clubModel.create(body)
            .then(club => {
              return User.addAsAdmin(user.id, club.username)
                .then(club => {
                  return User.addAsMember(user.id, club.username)
                    .then(club => {
                      return resolve(club)
                    })
                    .catch(err => {
                      return reject(err)
                    })
                })
            })
        })
        .catch(err => {
          return reject(err)
        })
    })
  }

  get(username) {
    return new Promise((resolve, reject) => {
      clubModel.findOne({ username })
      .then(club => {
        if (!club) {
          throw createError(404, "club not found")
        }
        return resolve(club)
      })
      .catch(err => {
        return reject(err)
      })
    })
  }

  getAll() {
    return new Promise((resolve, reject) => {
      clubModel.find()
        .then(clubs => {
          if (!clubs) {
            throw createError(404, "clubs not found")
          }
          return resolve(clubs)
        })
        .catch(err => {
          return reject(err)
        })
    })
  }

  update(body, username) {
    return new Promise((resolve, reject) => {
      clubModel.findOneAndUpdate(
        { username },
        body,
        { new: true }
      )
        .then(club => {
          if (!club) {
            throw createError(404, "club not found")
          } else {
            return resolve(club)
          }
        })
        .catch(err => {
          return reject(err)
        })
    })
  }
}

module.exports = new Club