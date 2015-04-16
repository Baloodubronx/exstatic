'use strict';

var mongoose = require('mongoose');

// define the schema for our user model
var postSchema = mongoose.Schema({
  ID : { type : Number, index:{unique:true, dropDups:true}},
  title : String,
  status : String,
  type: String,
  author: {
    username : String
  },
  content : String,
  date : {type: Date, default: Date.now},
  modified : {type : Date, default : Date.now},
  slug : String,
  excerpt : String,
  featured_image : Number,
  terms : {
    post_tag : [{
      ID : Number,
      name : String,
      slug : String,
      description : String
    }],
    category : [{
      ID : Number,
      name : String,
      slug : String,
      description : String
    }]
  }
});

// methods ======================

module.exports = mongoose.model('Post', postSchema);
