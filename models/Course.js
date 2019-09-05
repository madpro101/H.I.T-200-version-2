const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')


var CourseSchema = new mongoose.Schema({
  CourseCode: {
    type: String,
    required: true
  },
  CourseName: {
    type: String,
    required: true,
    unique: true,
  },
  Email: {
    type: String,
    required: true
  },
  
  Desc: {
    type: String,
    required: true
  }
})





CourseSchema.statics.findByCredentials = function (RegNumber, Password) {
  var Course = this

  return Course.findOne({Regno}).then( (Course) => {
    if (Course) {
      return new Promise((resolve, reject) => {
        bcrypt.compare(Password, Course.Password, (err, result) => {
          if (!err && result) {
            resolve(Course)
          } else {
            reject()
          }
        })
      })
    } else {
      return Promise.reject()
    }
  })
}

var Course = mongoose.model('Course', CourseSchema)

module.exports = {Course}