const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

var LecturerSchema = new mongoose.Schema({
  FullName: {
    type: String,
    required: true
  },
  Employee_no: {
    type: String,
    required: true,
    unique: true
  },
  Email: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true
  },
  
  Department: {
    type: String,
    required: true
  }
})

LecturerSchema.methods.toJSON = function () {
  return _.pick(this.toObject(), ['_id', 'FullName','Employee_no'])
}

LecturerSchema.pre('save', function(next) {
  var user = this

  if(user.isModified('Password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.Password, salt, (err, hash) => {
        user.Password = hash
        next()
      })
    })
  } else {
    next()
  }
})

LecturerSchema.statics.findByCredentials = function (Employee_no, Password) {
  var Lecturer = this

  return Lecturer.findOne({Employee_no}).then( (Lecturer) => {
    if (Lecturer) {
      return new Promise((resolve, reject) => {
        bcrypt.compare(Password, Lecturer.Password, (err, result) => {
          if (!err && result) {
            resolve(Lecturer)
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

var Lecturer = mongoose.model('Lecturer', LecturerSchema)

module.exports = {Lecturer}