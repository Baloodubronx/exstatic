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


// TEMPLATES related functions
//

exports.prepareTemplate = function(templateFile, cats, tags) {
  // GET TEMPLATE PATH
  var templatesDir = path.normalize(rootPath + '/theme/templates/');
  var templateFiles = [];
  // GET TEMPLATE FILES
  var templateGlob = glob.sync(templatesDir+'*.html');
  templateGlob.forEach(function (file) {
    templateFiles[file] = fs.readFileSync(file, {encoding:'utf8'});
  });

  var template = fs.readFileSync(templatesDir+templateFile, {encoding:'utf8'});

  // INSERT ANY FILE
  template = template.replace(/\{\{file: ([^\s]+)\}\}/gm,
    function(x,y){
      return templateFiles[templatesDir+y];
    }
  );

  // INSERT syle file
  template = template.replace(/\{\{style-file\}\}/gm, 'style.css');

  // replace categories
  var temp = '<ul class="cat-list">';
  cats.forEach(function(cat) {
    temp += '<li class="cat-list-item">';
    temp += '<a href="/'+cat.slug+'">' + cat.name +'</a></li>';
  });
  temp += '</ul>';
  template = template.replace(/\{\{categories\}\}/gm, temp);

  // replace tags
  temp = '<ul class="tag-list">';
  tags.forEach(function(tag) {
    temp += '<li class="tag-list-item">' + tag.name +'</li>';
  });
  temp += '</ul>';
  template = template.replace(/\{\{tags\}\}/gm, temp);

  return template;
};
