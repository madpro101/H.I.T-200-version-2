const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')


var TimetableSchema = new mongoose.Schema({
  Time: {
    type: Date,
    required: true
  },
  Duration: {
    type: String,
    required: true,
    unique: true,
  },
  Course: {
    type: String,
    required: true
  },
  Part: {
    type: String,
    required: true
  },
  Venue: {
    type: String,
    required: true
  }
})
TimetableSchema.methods.toJSON = function () {
  
}


var Timetable = mongoose.model('Timetable', TimetableSchema)

module.exports = {Timetable}