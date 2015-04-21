'use strict';
var express = require('express');
var router = express.Router();
//var marked = require('marked');
var Post = require('../models/post.model');

/* GET posts list. */
router.get('/', function(req, res) {
  Post.find({}, function(err, posts) {
    res.render('posts', { posts: posts });
  });
});

router.get('/write', function(req, res) {
  var temp = {};
  temp.title = 'New post';
  temp.content = 'Content comes here';
  temp.slug = 'new-post.html';
  res.render('editpost', {post:temp});
});

router.get('/save', function(req, res) {
  var newPost = new Post(req.query);
  newPost.save(function(err){
    if (err) console.log(err);
    res.redirect('/posts');
  });
});

router.get('/:id', function(req, res) {
  Post.findById(req.params.id, function(err, post) {
    res.render('editpost', {post:post});
  });
});

module.exports = router;
