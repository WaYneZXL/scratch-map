const mongoose = require('mongoose');
const config = require('../config.js');

mongoose.connect(MONGO_URL);

const Schema = mongoose.Schema;

const userSchema = new Schema({
  'id': {type: String, required: true, unique: true},
  'firstName': {type: String, required: true},
  'lastName': {type: String, required: true},
  'email': {type: String, required: true},
  'token': {type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);
