const userModel = require('../models/user')
const clubModel = require('../models/club')
const createError = require('http-errors')

class User {
  
  get(username){
    return new Promise((resolve, reject) => {
      userModel.findOne({ username: username })
        .then(user => {
          if (!user) {
            throw createError(404, "user not found")
          } else {
            resolve(user)
          }
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

  removeAsMember(userId, clubUsername) {
    return new Promise((resolve, reject) => {
      clubModel.findOne({ username: clubUsername })
        .then(() => {
          userModel.findByIdAndUpdate(
            userId,
            { club: undefined },
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


  delete(username) {
    return new Promise((resolve, reject) => {
      userModel.findOne({ username: username })
        .then(user => {
          if (!user) {
            throw createError(404, "user not found")
          }
          else if (user.club) {
            clubModel.findById(user.club)
              .then(club => {
                const isAdmin = club.admin.includes(user.id)

                if (isAdmin && club.admin.length === 1) {
                  throw createError(
                    401, 
                    "can't delete the user. Delete the club first"
                  )
                }
              })
              .catch(err => {
                return reject(err)
              })
          } else {
            userModel.findOneAndRemove()
              .then(user => {
                req.session.destroy()
                return resolve(user)
              })
          }
        })
        .catch(err => {
          return reject(err)
        })
    })
  }
}

module.exports = new User()