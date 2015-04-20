var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post'),
  async = require('async');
var getSlug = require('speakingurl');

module.exports = function (app) {
  app.use('/api', router);
};


// A NEW POST
router.post('/post/save', function (req, res) {
  var newPost = new Post(req.body.post);
  newPost.save(function(err, post){
    if (err) console.log('err: '+err);
    res.json({post : post});
  });
});

// AN EXISTING POST
router.post('/post/:postid', function(req, res){
  var postid = req.params.postid;
  var thepost = req.body.post;
  thepost.modified = Date.now();
  checkTags(req.body.tags, function(returnedTags) {
    thepost.tags= returnedTags;
    console.log(thepost.tags);
    Post.findByIdAndUpdate(postid, thepost, function(err, updated){
      if (err) console.log('err:' + err);
      res.json({post:thepost});
    });
  });
});

function checkTags(tags, callback) {
  async.eachSeries(tags, function(onetag, cb) {
    if (!onetag.slug) {
      onetag.slug = getSlug(onetag.name);
    }
    cb();
  },
  function(err){
    if (err) console.log(err);
    callback(tags);
  });
}

router.post('/makeslug', function(req, res){
  var name = req.body.name;
  var slug = getSlug(name);
  res.json({slug:slug});
});
