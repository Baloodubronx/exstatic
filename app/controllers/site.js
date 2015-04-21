var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post'),
  generator = require('../functions/generator');

module.exports = function (app) {
  app.use('/preview', router);
};

router.get('/:postID', function (req, res) {
  Post.findById(req.params.postID, function(err, post) {
    if (err) console.log('err: ' + err);
    generator.previewFromPost(post, function(url){
      res.redirect('/temp/'+url);
    });
  });
});
