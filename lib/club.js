const clubModel = require('../models/club')
const userModel = require('../models/user')
const User = require('./user')
const createError = require('http-errors')
const ObjectId = require('mongoose').Types.ObjectId


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

  get(clubUsername) {
    return new Promise((resolve, reject) => {
      const searchingValue = ObjectId.isValid(clubUsername) ?
        { _id: clubUsername} : { username: clubUsername }

      clubModel.findOne(searchingValue)
      .then(club => {
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

  update(body, clubUsername) {
    return new Promise((resolve, reject) => {
      const searchingValue = ObjectId.isValid(clubUsername) ?
        { _id: clubUsername} : { username: clubUsername }

      clubModel.findOneAndUpdate(
        searchingValue,
        body,
        { new: true }
      )
        .then(club => {
            return resolve(club)
        })
        .catch(err => {
          return reject(err)
        })
    })
  }
}

module.exports = new Club