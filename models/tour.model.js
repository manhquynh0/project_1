const mongoose = require('mongoose');

const tour = mongoose.model('Tour', {
  name: String,
  major: String,
  age: Number
}, )

module.exports = tour 
