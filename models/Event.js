const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')


var EventSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  Desc: {
    type: String,
    required: true,
    unique: true,
  },
  Date: {
    type: String,
    required: true
  }
})


var Event = mongoose.model('Event', EventSchema)

module.exports = {Event}