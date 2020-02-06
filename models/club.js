const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clubSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  admin: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true 
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
  },
  official: {
    type: Boolean,
    default: false,
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    isOfficial: {
      type: Boolean,
      default: false
    },
    membershipNumber: {
      type: String,
      default: undefined
    }
  }],
  events: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  address: {
    type: String,
  },
  zipcode: {
    type: Number
  },
  city: {
    type: String
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

const Club = mongoose.model('Club', clubSchema)

module.exports = Club