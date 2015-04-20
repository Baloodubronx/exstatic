var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post'),
  moment = require('moment');

module.exports = function (app) {
  app.use('/preview', router);
};

router.get('/', function (req, res, next) {
  Post.find().sort({modified:-1}).exec(function (err, posts) {
    if (err) return next(err);
    res.render('index', {
      posts: posts
    });
  });
});
