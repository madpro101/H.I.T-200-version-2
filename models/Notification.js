
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')


var NotificationSchema = new mongoose.Schema({
  Desc: {
    type: String,
    required: true
  },
  Ntype:{
    type: String,
    required: true,
    
  },
  Sender: {
    type: String,
    required: true
  },
  Date: {
    type: String,
    required: true
  },
  
 
})

NotificationSchema.methods.toJSON = function () {
  
}



var Notification = mongoose.model('Notification', NotificationSchema)

module.exports = {Notification}