'use strict';
var express = require('express');
var router = express.Router();
var marked = require('marked');
var Post = require('../models/post.model');

/* GET posts list. */
router.get('/', function(req, res, next) {
  Post.find({}, function(err, posts) {
    res.render('posts', { posts: posts });
  })
});

router.get('/write', function(req, res, next) {
  var temp = {};
  temp.title = 'New post';
  temp.content = 'Content comes here';
  temp.slug = 'new-post.html';
  res.render('index', {post:temp});
});

router.get('/save', function(req, res, next) {
  console.log(req.query);
  var newPost = new Post(req.query);
  newPost.save(function(err){
    res.redirect('/posts');
  });

})

router.get('/:id', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    res.render('index', {post:post});
  });
});

module.exports = router;
