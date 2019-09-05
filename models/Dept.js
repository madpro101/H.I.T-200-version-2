const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')


var DeptSchema = new mongoose.Schema({
  Id: {
    type: String,
    required: true
  },
  Desc: {
    type: String,
    required: true,
    unique: true,
  }
})


var Dept = mongoose.model('Dept', DeptSchema)

module.exports = {Dept}