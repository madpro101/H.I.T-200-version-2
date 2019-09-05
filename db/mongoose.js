const mongoose = require('mongoose')

mongoose.Promise = global.Promise
var options = {
  useNewUrlParser: true,
  useCreateIndex: true
}

mongoose.connect('mongodb://localhost:27017/SmartCampus', options)

mongoose.connection.on('error', () => {
  console.log('Error trying to connect to database')
  process.exit()
})

module.exports = {mongoose}