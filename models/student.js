const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
/// dont forget date
var StudentSchema = new mongoose.Schema({
  FullName: {
    type: String,
    required: true
  },
  Regno: {
    type: String,
    required: true,
    unique: true,
  },
  Email: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true
  },
  School: {
    type: String,
    required: true
  },
  Dept: {
    type: String,
    required: true
  },
  img: { data: Buffer, contentType: String }
})

StudentSchema.methods.toJSON = function () {
  return _.pick(this.toObject(), ['_id', 'FullName','Regno'])
}

StudentSchema.pre('save', function(next) {
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

StudentSchema.statics.findByCredentials = function (Regno, Password) {
  var Student = this

  return Student.findOne({Regno}).then( (student) => {
    if (student) {
      return new Promise((resolve, reject) => {
        bcrypt.compare(Password, student.Password, (err, result) => {
          if (!err && result) {
            resolve(student)
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

var Student = mongoose.model('Student', StudentSchema)

module.exports = {Student}