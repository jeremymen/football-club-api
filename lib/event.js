const eventModel = require('../models/event')
const clubModel = require('../models/club')
const User = require('./user')

class Event {

  create(body, clubUsername, creatorId) {
    return new Promise((resolve, reject) => {
      clubModel.findOne({ username: clubUsername }) 
        .then(club => {
          const event = new eventModel({
            title: body.title,
            typeOfEvent: body.typeOfEvent,
            date: Date(body.date),
            time: body.time,
            createdBy: creatorId,
            club: club.id,
          })

          event.save()
            .then(event => resolve(event))
            .catch(err => reject(err))
        })
    })
  }

  getAll() {
    return new Promise((resolve, reject) => {
      eventModel.find()
      .then(events => resolve(events))
      .catch(err => reject(err))
    })
  }

  getOne(id) {
    return new Promise((resolve, reject) => {
      eventModel.findById(id)
        .then(event => resolve(event))
        .catch(err => reject(err))
    })
  }

  getClubEvents(clubUsername) {
    return new Promise((resolve, reject) => {

      clubModel.findOne(clubUsername)
        .then(club => {
          eventModel.find({ club: club.id })
          .then(events => resolve(events)
          )
          .catch(err => reject(err))
        })
        .catch(err => reject(err))
      })
  }

  addAMember(eventId, userUsername) {
    return new Promise((resolve, reject) => {

      User.getOne(userUsername)
        .then(user => {
          eventModel.findOne({ _id: eventId })
            .then(event => {
              return eventModel.findByIdAndUpdate(
                eventId,
                { participants: [...event.participants, user.id] },
                { new: true }
              )
                .then(event => resolve(event.participants))
            })
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
      })
  }

  removeAMember(eventId, userUsername) {
    return new Promise((resolve, reject) => {

      User.getOne(userUsername)
        .then(user => {
          eventModel.findOne({ _id: eventId })
            .then(event => {
              return eventModel.findByIdAndUpdate(
                eventId,
                { 
                  participants: event.participants.filter(
                    participant => participant.toString() !== user.id.toString()
                  ), 
                },
                { new: true }
              )
                .then(event => resolve(event.participants))
            })
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
      })
  }

  delete(eventId) {
    return new Promise((resolve, reject) => {
      eventModel.findByIdAndDelete(eventId)
        .then(event => resolve(event))
        .catch(err => reject(err))
    })
  }
}

module.exports = Event

