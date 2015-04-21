var http = require('http');
var ent = require('ent');
var toMarkdown = require('to-markdown');
var marked = require('marked');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var Post = require('../../app/models/post.model');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/exstatic');

var mediaManager = require('./media.js')

var workingurl = 'http://www.natura-sciences.com/wp-json/';

function getPosts(url, page) {
  var link = url+'posts?page='+page;
  var str = '';
  var getRequest = http.get(link, function(response) {
		response.on('data', function (chunk) {
			str += chunk;
		});
		response.on('end', function () {
      str=unescape(str);
			var json=JSON.parse(str);
      console.log('retreiving page '+page);
      processPosts(json);
      if (json.length) {
        //getPosts(url, ++page);
      }
		});
	});

	getRequest.on('error', function (err) {
		console.log(err);
	});
}

function processOnePost(post){
  var content = post.content;

  // STEP 1: extract any potential medias
  var premedias = content.match(/id="attachment_[0-9]+"/g);
  var medias = [];
  if (premedias !== null) {
    premedias.forEach(function(media){
      var tempmed = media.match(/[0-9]+/g);
      medias.push(tempmed[0]);
    });
  }
  // STEP 2: replace the media div with a placeholder

  medias.forEach(function(media){
    //mediaManager.importMedia(workingurl, media);
    var tempstr = '<div.+id="attachment_'+media+'".+>.+<\/div>';
    var regexp = new RegExp(tempstr, "g");
    var replacement = ' $[media '+media+'] ';
    content = content.replace(regexp, replacement);
  });

  // STEP 3: conserve iframes

  var iframes=[];
  iframes = content.match(/<iframe.+\/iframe>/g);
  if (iframes !== null) {
    iframes.forEach(function(iframe){
      var src = '';
      src = iframe.match(/src=(["'])(?:(?=(\\?))\2.)*?\1/g);
      if (src !== null) {
        var regtemp = new RegExp(iframe, 'g');
        var tubelink = '$[iframe ' + src + ']';
        content = content.replace(regtemp, tubelink);
      }
    });
  }
  // STEP 3: convert content to markdown

  var mdcontent = '';
  mdcontent = toMarkdown(content);
  //console.log(mdcontent)

  var d = new Date(post.date);
  var dir = '../temp/posts/' + d.getFullYear() + '/' + d.getMonth();

  mkdirp(dir, function(err){
    if (err) console.log(err);
    var filename = dir + '/'+ post.slug + '.md';
    fs.writeFile(filename, mdcontent, function(err) {
      if (err) console.log(err);
    });
  });

  post.content = mdcontent;

  var newPost = new Post(post);
  newPost.save(function(err){
    if (err) console.log(err);
  });


}

function processPosts(json) {
  // PRE: decode each items
  json.forEach(function(item){
    item.title = ent.decode(item.title);
    item.content = ent.decode(item.content);
    processOnePost(item);
  });
}


getPosts(workingurl, 1);
