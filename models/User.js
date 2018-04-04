const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  'id': {type: String, required: true, unique: true},
  'name': {type: String, required: true},
  'email': String
});

module.exports = mongoose.model('User', userSchema);
