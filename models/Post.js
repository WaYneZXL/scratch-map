const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var postSchema = new mongoose.Schema({
  userId: Schema.Types.ObjectId,
  post: String,
  location: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
