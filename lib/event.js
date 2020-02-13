const eventModel = require('../models/event')
const clubModel = require('../models/club')

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
            .then(event => {
              return resolve(event)
            })
            .catch(err => {
              return reject(err)
            })
        })
    })
  }
}

module.exports = Event