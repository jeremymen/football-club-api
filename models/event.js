const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  typeOfEvent: {
    type: String,
    enum: ['Football match', 'other'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  resultOfTheGame: {
    type: String,
    default: ''
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

const Event = mongoose.model('Event', eventSchema)

module.exports = Event