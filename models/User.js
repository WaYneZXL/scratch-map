const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
  name: String,
  userid: String,
  updated_at: { type: Date, default: Date.now },
});

UserSchema.statics.findOrCreate = require("find-or-create");

module.exports = mongoose.model('User', userSchema);
