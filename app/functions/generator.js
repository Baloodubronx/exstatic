var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');
var fs = require('fs');
var glob = require('glob');
var marked = require('marked');
var async = require('async');
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var mkdirp = require('mkdirp');
var _ = require('lodash');

var xTemplate = require('./templates');
var xTerms = require('./terms');


function xSet(template, reg, rep) {
  var temp = new RegExp(reg, "gm");
  return template.replace(temp, rep);
}

function xSetMulti(template, inserts) {
  var temp = template;
  for (var key in inserts) {
    temp = xSet(temp, '{{'+key+'}}', inserts[key]);
  }

  return temp;
}

function writefile(dir, filename, template, cb) {
  mkdirp(dir, function(){
    fs.writeFileSync(dir+filename, template);
    cb();
  });
}


exports.previewFromPost = function(post, callback) {

  xTerms.getCatsAndTags(function(err, cats, tags){
    var final = xTemplate.prepareTemplate('article.html', cats, tags);

    var inserts = {
      'post-title':post.title,
      'post-content': marked(post.content),
      'page-title' : 'Preview - ' + post.title
    };

    final = xSetMulti(final, inserts);

    writefile('site/temp/', post.slug+'.html', final, function() {
      callback(post.slug+'.html');
    });
  });

};




// MAKE ALL THE SITE

exports.makeAllSite = function(callback) {
  console.time('site making');
  xTerms.getCatsAndTags(function(err, cats, tags) {
    async.parallel([
      makeHomePage.bind(null, cats, tags),
      //makeCategories.bind(cats, tags, null),
      //makeTags.bind(cats, tags, null),
      makePosts.bind(null, cats, tags),
    ],
    function(err){
      // callback final
      handleStyle();
      console.timeEnd('site making');
      callback(err);
    });
  });
};

function handleStyle() {
  fs.createReadStream(rootPath+'/theme/style.css').pipe(fs.createWriteStream('site/style.css'));
}

// make the home page > /index.html
function makeHomePage(cats, tags, callback) {
  var template = xTemplate.prepareTemplate('home.html', cats, tags);

  template = xSet(template, '{{page-title}}', 'Natura-Sciences.com');

  var lastArt = '';
  Post.find({}, function(err, posts) {
    posts.forEach(function(post){
      lastArt += '<p>';
      lastArt += '<a href="' + post.terms.category[0].slug + '/' + post.slug + '.html">';
      lastArt += post.title;
      lastArt += '</a></p>';
      lastArt += '<p>' + post.excerpt + '</p>';
    });

    template = xSet(template, '{{last-articles}}', lastArt);
    var dir = 'site/';
    var filename = 'index.html';
    writefile(dir, filename, template, function() {
      callback(null);
    });
  });
}




function makeCategories(cats, tags, callback) {

  callback();
}

function makeTags(cats, tags, callback) {

  callback();
}

function makePosts(cats, tags, callback) {
  Post.find({}, function(err, posts){
    async.each(
      posts,
      function(post, cb){
        generatePostFile(post, cats, tags, cb);
      },
      function(err) {
        if (err) console.log(err);
        callback();
      }
    );
  });
}


function generatePostFile(post, cats, tags, callback) {
  var final = xTemplate.prepareTemplate('article.html', cats, tags);
  var postTags = '';

  // replace tags
  postTags = '<ul class="tag-list">';
  post.terms.post_tag.forEach(function(tag) {
    postTags += '<li class="tag-list-item">' + tag.name +'</li>';
  });
  postTags += '</ul>';

  var inserts = {
    'post-title' : post.title,
    'post-content' : marked(post.content),
    'page-title' : post.title,
    'post-tags' : postTags
  };

  final = xSetMulti(final, inserts);

  var dir = 'site/'+post.terms.category[0].slug+'/';
  writefile(dir, post.slug+'.html', final, function() {
    callback(null);
  });
}
