const userModel = require('../models/user')
const clubModel = require('../models/club')
const createError = require('http-errors')
const ObjectId = require('mongoose').Types.ObjectId
const mailer = require('../config/mailer')


class User {

  create(user) {
    return new Promise((resolve, reject) => {
      userModel.create(user)
        .then(user => {
          mailer.sendValidateEmail(user)
          return resolve(user)
        })
        .catch(err => {
          return reject(err)
        })
    })
  }

  validate(validationToken) {
    return new Promise((resolve, reject) => {
      userModel.findOne({ validationToken })
        .then(user => {
          if (user) {
            user.validated = true
            user.save()
              .then(() => {
                return resolve(user)
              })
              .catch(err => reject(err))
            } else {
            throw createError(404, 'user not found')
          }
        })
        .catch(err => reject(err))
    })
  }

  update(body, userUsername) {
    return new Promise((resolve, reject) => {
      this.getOne(userUsername)
        .then(user => {
          userModel.findOneAndUpdate(
            { _id: user._id },
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
        
    })
  }

  login(email, password) {
    return new Promise((resolve, reject) => {
      userModel.findOne({ email: email, validated: true })
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
      userModel.findOne({ $or: [
        { _id: (ObjectId.isValid(userUsername)) ? userUsername : null },
        { username: userUsername }
      ]})
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
        .then(club => {
          return userModel.findOne({ username: userUsername }) 
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
                return userModel.findOneAndUpdate(
                  { username: userUsername },
                  { club: undefined },
                  { new: true }
                )
                  .then((user) => {
                    return resolve(user)
                  })
              } else {
                throw createError(401, 'user is not authorizated')
              } 
            })
        })
        .catch(err => {
          return reject(err)
        })
    })
  }

  delete(userUsername) {
    return new Promise((resolve, reject) => {
      this.getOne(userUsername)
        .then(user => {
          userModel.findOneAndDelete({ _id: user._id })
            .then(user => resolve(user))
            .catch(err => reject(err))
        })

    })
  }
}

module.exports = new User()