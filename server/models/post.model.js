'use strict';

var mongoose = require('mongoose');

// define the schema for our user model
var postSchema = mongoose.Schema({
  type: String,
  title: String,
  author: String,
  content: String,
  date : {type: Date, default: Date.now},
  slug : String
});

// methods ======================

module.exports = mongoose.model('Post', postSchema);
