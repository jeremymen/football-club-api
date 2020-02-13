const userModel = require('../models/user')
const clubModel = require('../models/club')
const createError = require('http-errors')
const ObjectId = require('mongoose').Types.ObjectId


class User {

  create(body) {
    return new Promise((resolve, reject) => {
      userModel.create(body)
        .then(user => {
          return resolve(user)
        })
        .catch(err => {
          return reject(err)
        })
    })
  }

  update(body, userUsername) {
    return new Promise((resolve, reject) => {
      const searchingValue = ObjectId.isValid(userUsername) ?
        { _id: userUsername} : { username: userUsername }

      userModel.findOneAndUpdate(
        searchingValue,
        body,
        { new: true }
      )
        .then(user => {
          return resolve(user)
        })
        .catch(err => {
          return reject(err)
        })
    })
  }

  login(email, password) {
    return new Promise((resolve, reject) => {
      userModel.findOne({ email })
        .then(user => {
          if(!user) {
            throw createError(404, 'user not found')
          } else {
            user.checkPassword(password)
              .then(match => {
                if(!match) {
                  throw createError(400, 'invalid password')
                } else {
                  return resolve(user)
                }
              })
              .catch(err => {
                return reject(err)
              })
          }
        })
        .catch(err => {
          return reject(err)
        })
    })
  }
  
  getOne(userUsername){
    return new Promise((resolve, reject) => {
      const searchingValue = ObjectId.isValid(userUsername) ?
        { _id: userUsername} : { username: userUsername }

      userModel.findOne(searchingValue)
        .then(user => {
          resolve(user)
        })
        .catch(err => {
          return reject(err)
        })
    })
  }

  getAll() {
    return new Promise((resolve, reject) => {
      userModel.find()
        .then(users => {
          if (!users) {
            throw createError(404, "users not found")
          }
          return resolve(users)
        })
        .catch(err => {
          return reject(err)
        })
    })
  }

  addAsAdmin(userId, clubUsername) {
    return new Promise((resolve, reject) => {
      clubModel.findOne({ username: clubUsername })
        .then(club => {

          clubModel.findOneAndUpdate(
            { username: clubUsername },
            { admin: [...club.admin, userId] },
            { new: true }
          )
            .then(club => {
              return resolve(club)
            })
            .catch(err => {
              return reject(err)
            })
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  addAsMember(userId, clubUsername) {
    return new Promise((resolve, reject) => {
      clubModel.findOne({ username: clubUsername })
        .then(club => {
          userModel.findByIdAndUpdate(
            userId,
            { club: club.id },
            { new: true }
          )
            .then((user) => {
              return resolve(user)
            })
            .catch(err => {
              return reject(err)
            })
        })
        .catch(err => {
          return reject(err)
        })
    })
  }

  removeAsMember(userId, userUsername, clubUsername) {
    return new Promise((resolve, reject) => {
      clubModel.findOne({ username: clubUsername })
        .then((club) => {
          userModel.findOne({ username: userUsername }) 
            .then(user => { 
              const currentUser = userId.toString() === (user.id).toString()
              const isAdmin = club.admin.includes(userId)
              const theLastAdmin = isAdmin && club.admin.length === 1

              if (currentUser && isAdmin && theLastAdmin){
                throw createError(
                  403, 
                  'you are the only one admin! you cannot leave the club'
                )
              } else if (!currentUser && !isAdmin) {
                throw createError(401, 'user is not authorizated')
              } else if (currentUser || (!currentUser && isAdmin)) {
                userModel.findOneAndUpdate(
                  { username: userUsername },
                  { club: undefined },
                  { new: true }
                )
                  .then((user) => {
                    return resolve(user)
                  })
                  .catch(err => {
                    return reject(err)
                  })
              } else {
                throw createError(401, 'user is not authorizated')
              } 
            })
            .catch(err => {
              return reject(err)
            })
        })
        .catch(err => {
          return reject(err)
        })
    })
  }


  delete(userUsername) {
    return new Promise((resolve, reject) => {
      const searchingValue = ObjectId.isValid(userUsername) ?
        { _id: userUsername} : { username: userUsername }

      userModel.findOneAndDelete(searchingValue)
        .then(user => {
          return resolve(user)
        })
        .catch(err => {
          return reject(err)
        })
    })
  }
}

module.exports = new User()