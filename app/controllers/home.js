var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post'),
  moment = require('moment');

module.exports = function (app) {
  app.use('/app/', router);
};

router.get('/', function (req, res, next) {
  Post.find().sort({modified:-1}).exec(function (err, posts) {
    if (err) return next(err);
    res.render('index', {
      posts: posts
    });
  });
});

router.get('/post/new', function(req, res){
  var emptypost = {
    title : 'Article title',
    content : 'Article content\r\n\r\n# Title 1\r\n# Title 2\r\n# Title 3\r\n\r\n** bold **\r\n*italic*',
    slug : 'new-article',
    terms: {
      post_tag : [],
      category : []
    }
  };
  res.render('editpost',
    {
      post:emptypost,
      pagetitle:'new post'
    });
});

router.get('/post/:slug', function(req, res){
  var tempslug = req.params.slug;
  Post.findOne({slug:tempslug}, function(err, post){
    if (err) console.log(err);
    post.realdate = moment(post.date).format('DD/MM/YY, H:mm');
    post.realmodifieddate = moment(post.modified).format('DD/MM/YY, H:mm');
    if (post) {
      res.render('editpost', {post:post});
    }
    else {
      res.redirect('/');
    }
  });
});
