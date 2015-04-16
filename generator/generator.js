var marked = require('marked');
var fs = require('fs');
var mkdirp = require('mkdirp');
var Post = require('../models/post.model');
var mongoose = require('mongoose');
var async = require('async');
var jade = require('jade');

function replaceFrames(content) {
  var replace = content.replace(/\$\[iframe (src=\".+\")\]/g, '<iframe width="500px" height="400px" $1></iframe>');
  return replace;
}

function savePost(post, callback) {
  var dir = '../temp/generated/';
  dir += post.terms.category[0].slug + '/';

  post.content = replaceFrames(post.content);
  var categories = [];
  categories.push({name:'Agriculture', slug:'agriculture'});
  var html = jade.renderFile('../templates/article.jade',
    {
      marked:marked,
      pagetitle: post.title,
      post:post,
      categories : categories
    });
  mkdirp(dir, function(err){
    if (err) console.log(err);

    var filename = dir + '/'+ post.slug + '.html';
    fs.writeFile(filename, html, function(err) {
      if (err) console.log(err);
      //console.log('saved '+post.title);
      callback();
    });
  });
}

function generate() {
  mongoose.connect('mongodb://localhost/exstatic');

  Post.find({}, function(err, posts){
    async.eachSeries(posts,
      savePost,
      function(err) {
        if (err) console.log(err);
        process.exit(0);
      }
    );
  });
}

generate();
