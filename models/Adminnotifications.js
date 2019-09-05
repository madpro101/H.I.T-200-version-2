const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')


var AdminnotificationSchema = new mongoose.Schema({
  Desc: {
    type: String,
    required: true
  },
  
  Sender: {
    type: String,
    required: true
  },
  Date: {
    type: Date,
    required: true
  },
  Time: {
    type: String,
    required: true
  },
  
 
})

AdminnotificationSchema.methods.toJSON = function () {
  return _.pick(this.toObject(), ['_id','Desc','Sender'])
}



var Adminnotification = mongoose.model('Adminnotification', AdminnotificationSchema)

module.exports = {Adminnotification}