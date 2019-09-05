const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

/// dont forget date
var PostsSchema = new mongoose.Schema({
  Desc: {
    type: String,
    required: true
  },
  Sender: {
    type: String,
    required: true,
    unique: true,
  },
  Ntype: {
    type: String,
    required: true
  },
  Date: {
    type: String,
    required: true
  },
  
  Dept: {
    type: String,
    required: true
  }
})
 
PostsSchema.methods.toJSON = function () {
  
}



var Posts = mongoose.model('Posts', PostsSchema)

module.exports = {Posts}