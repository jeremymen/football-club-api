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
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  club: {
    type: Schema.Types.ObjectId,
    ref: 'Club',
    required: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  numberOfParticipant: {
    type: Number,
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

function defaultNumberOfParticipants(next) {
  const event = this
  event.numberOfParticipant = event.participants.length
  next()
}

eventSchema.pre('save', defaultNumberOfParticipants)

const Event = mongoose.model('Event', eventSchema)

module.exports = Event