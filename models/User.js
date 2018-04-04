const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
  id: String,
  token: String,
  name: String,
  email: String
});

module.exports = mongoose.model('User', userSchema);
