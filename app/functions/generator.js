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

exports.previewFromPost = function(post, calibaqui) {
  // GET TEMPLATE PATH
  var templatesDir = path.normalize(rootPath + '/theme/templates/');
  var templateFiles = [];
  // GET TEMPLATE FILES
  var templateGlob = glob.sync(templatesDir+'*.html');
  templateGlob.forEach(function (file) {
    templateFiles[file] = fs.readFileSync(file, {encoding:'utf8'});
  });

  var articleTemplate = fs.readFileSync(templatesDir+'article.html', {encoding:'utf8'});
  var final = articleTemplate;

  // INSERT ANY FILE
  final = final.replace(/\{\{file: ([^\s]+)\}\}/gm,
    function(x,y){
      return templateFiles[templatesDir+y];
    }
  );

  // INSERT syle file
  final = final.replace(/\{\{style-file\}\}/gm, 'style.css');
  // INSERT page title
  final = final.replace(/\{\{post-title\}\}/g, post.title);
  // INSERT content
  final = final.replace(/\{\{post-content\}\}/g, marked(post.content));
  async.waterfall([
    // STEP 1: get categories
    function(cb) {
      xTerms.getCatsAndTags(cb);
    },

    // STEP 2: replace categories
    function(cats, tags, cb) {
      var temp = '<ul class="cat-list">';
      cats.forEach(function(cat) {
        temp += '<li class="cat-list-item">' + cat.name +'</li>';
      });
      temp += '</ul>';
      final = final.replace(/\{\{categories\}\}/gm, temp);
      cb(null);
    },

    // STEP 3:


  ],
    // Final callback
    function(err){
      if (err) console.log(err);
      console.log(post);
      fs.writeFileSync('site/temp/'+post.slug+'.html', final);
      fs.createReadStream(rootPath+'/theme/style.css').pipe(fs.createWriteStream('public/temp/style.css'));
      calibaqui(post.slug+'.html');
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
    });

    template = xSet(template, '{{last-articles}}', lastArt);
    var dir = 'site/';
    var filename = 'index.html';
    writefile(dir, filename, template, function() {
      callback(null);
    });
  });
}

function xSet(template, reg, rep) {
  var temp = new RegExp(reg, "gm");
  return template.replace(temp, rep);
}

function writefile(dir, filename, template, cb) {
  mkdirp(dir, function(){
    fs.writeFileSync(dir+filename, template);
    cb();
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
        generateFile(post, cats, tags, cb);
      },
      function(err) {
        if (err) console.log(err);
        callback();
      }
    );
  });
}


function generateFile(post, cats, tags, calibacky) {
  // GET TEMPLATE PATH
  var templatesDir = path.normalize(rootPath + '/theme/templates/');
  var templateFiles = [];
  // GET TEMPLATE FILES
  var templateGlob = glob.sync(templatesDir+'*.html');
  templateGlob.forEach(function (file) {
    templateFiles[file] = fs.readFileSync(file, {encoding:'utf8'});
  });

  var articleTemplate = fs.readFileSync(templatesDir+'article.html', {encoding:'utf8'});
  var final = articleTemplate;

  // INSERT ANY FILE
  final = final.replace(/\{\{file: ([^\s]+)\}\}/gm,
    function(x,y){
      return templateFiles[templatesDir+y];
    }
  );
  // INSERT syle file
  final = final.replace(/\{\{style-file\}\}/gm, 'style.css');
  // INSERT page title
  final = final.replace(/\{\{post-title\}\}/g, post.title);
  // INSERT content
  final = final.replace(/\{\{post-content\}\}/g, marked(post.content));

  // Replace categories
  var temp = '<ul class="cat-list">';
  cats.forEach(function(cat) {
    temp += '<li class="cat-list-item">' + cat.name +'</li>';
  });
  temp += '</ul>';
  final = final.replace(/\{\{categories\}\}/gm, temp);

  var dir = 'site/'+post.terms.category[0].slug+'/';
  mkdirp(dir, function(){
    fs.writeFileSync(dir+post.slug+'.html', final);
    calibacky(null);
  });
}
