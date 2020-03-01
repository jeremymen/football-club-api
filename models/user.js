const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
const SALT_WORK_FACTOR = 10

//generate a random string of 15 char
const randomString = () => {
  return Math.random().toString(36).substring(2, 15)
}

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: EMAIL_PATTERN,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  validationToken: {
    type: String,
    default: () => randomString() + randomString()
  },
  validated: {
    type: Boolean,
    default: true
  },
  club: {
    type: Schema.Types.ObjectId,
    ref: 'Club',
    default: null
  },
  profilePicture: {
    type: String,
    default: '../../../defaultUserProfilePicture.png'
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = doc._id
      delete ret._id
      delete ret.__v
      delete ret.password
      delete ret.validationToken
      return ret
    }
  }
}
)
userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password)
}

userSchema.pre('save', function (next) {
  const user = this

  if (user.isModified('password')) {
    bcrypt.genSalt(SALT_WORK_FACTOR)
      .then(salt => {
        return bcrypt.hash(user.password, salt)
          .then(hash => {
            user.password = hash
            next()
          });
      })
      .catch(error => next(error))
  } else {
    next()
  }
})

userSchema.pre('findOneAndUpdate', async function () {
  if (this._update.password){
    this._update.password = await bcrypt.hash(this._update.password, SALT_WORK_FACTOR)
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User