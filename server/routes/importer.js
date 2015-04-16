var express = require('express');
var router = express.Router();
var fs =require('fs');
var path =  require('path');
var toMarkdown = require('to-markdown');
var http = require('http');
var ent = require('ent');

router.get('/', function(req, res) {
  res.render('importer');
});

router.get('/this', function(req, res) {
  //console.log(req.query.theurl);
  var link = req.query.theurl;
	var str='';
  var json;

  var getRequest = http.get(link, function(response) {
		response.on('data', function (chunk) {
			str += chunk;
		});
		response.on('end', function () {
      str=unescape(str);
			json=JSON.parse(str);
      json.forEach(function(item){
        item.title = ent.decode(item.title);
        item.content = ent.decode(item.content);
      });
      //json = ent.decode(json);
      res.render('importer', {json:json});
		});
	});

	getRequest.on('error', function (err) {
    		console.log(err);
		});

});

module.exports = router;
