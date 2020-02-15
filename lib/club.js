const clubModel = require('../models/club')
const userModel = require('../models/user')
const User = require('./user')
const createError = require('http-errors')
const ObjectId = require('mongoose').Types.ObjectId


class Club {

  create(body, userId) {
    return new Promise((resolve, reject) => {
      userModel.findById(userId)
        .then(user => {
          clubModel.create(body)
            .then(club => {
              return User.addAsAdmin(user.id, club.username)
                .then(() => {
                  return User.addAsMember(user.id, club.username)
                    .then(() => {
                      return resolve(club)
                    })
                    .catch(err => {
                      return reject(err)
                    })
                })
            })
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
  }

  getOne(clubUsername) {
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

  getAllUsers(clubUsername) {
    return new Promise((resolve, reject) => {
      const searchingValue = ObjectId.isValid(clubUsername) ?
        { _id: clubUsername} : { username: clubUsername }

      clubModel.findOne(searchingValue)
        .populate({
          path: 'users'
        })
        .then(users => {
          resolve(users.users)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  removeManyUsers(users) {
    return new Promise((resolve, reject) => {
          users.map(user => {
          userModel.update(
            { _id: user.id },
            { club: null },
            { new: true }
          )
            .then(user => resolve(user))
            .catch(err => reject(err))
        })
    })
  }

  delete(clubUsername) {
    return new Promise((resolve, reject) => {
      const searchingValue = ObjectId.isValid(clubUsername) ?
        { _id: clubUsername} : { username: clubUsername }
      
      clubModel.findOneAndDelete(searchingValue)
        .then(user => resolve(user))
        .catch(err => reject(err))
    })
  }
}

module.exports = new Club