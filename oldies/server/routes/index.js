var express = require('express');
var router = express.Router();
var Post = require('../../models/post.model');

/* GET home page. */
router.get('/', function(req, res) {
  Post.find({}, function(err, posts){
    res.render('index', {posts:posts});
  });
});

router.get('/post/:slug', function(req, res){
  var tempslug = req.params.slug;
  Post.findOne({slug:tempslug}, function(err, post){
    if (err) console.log(err);
    if (post) {
      res.render('editpost', {post:post});
    }
    else {
      res.redirect('/');
    }
  });
});


module.exports = router;
