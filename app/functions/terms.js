var async = require('async');
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var _ = require('lodash');

exports.getCatsAndTags = function(cb) {
  var cats = [], tags = [];
  Post.find({}, function(err, posts) {
    if (err) console.log(err);
    posts.forEach(function(post) {
      if (post.terms) {
        if (post.terms.category[0]) {
          cats.push(post.terms.category[0]);
        }
        if (post.terms.post_tag) {
          post.terms.post_tag.forEach(function(tag) {
            tags.push(tag);
          });
        }
      }
    });

    cats = _.unique(cats, 'name');
    tags = _.unique(tags, 'name');
    cb(err, cats, tags);
  });
};
