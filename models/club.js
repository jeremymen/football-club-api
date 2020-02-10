const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clubSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    default: ''
  },
  username: {
    type: String,
    unique: true,
    lowercase: true,
  },
  admin: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  teamCountry: {
    type: String,
    required: true
  },
  teamLeague: {
    type: String,
    required: true
  },
  team: {
    type: String,
    required: true
  },
  clubEmblem: {
    type: String,
    default: '../public/images/defaultClubEmblem.png'
  },
  description: {
    type: String,
    default: ''
  },
  isOfficialClub: {
    type: Boolean,
    default: false,
  },
  events: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  address: {
    type: String
  },
  zipcode: {
    type: Number
  },
  city: {
    type: String,
    required: true
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
      return ret
    }
  }
})

clubSchema.pre('save', function(next) {
  const club = this
  club.username = club.name.split(' ').join('')
  next()
})

clubSchema.pre('findOneAndUpdate', function(next) {
  const club = this
  club._update.username = club._update.name.split(' ').join('')
  next()
})


const Club = mongoose.model('Club', clubSchema)

module.exports = Club