var express = require('express');
var router = express.Router();
var fs =require('fs');
var path =  require('path');
var toMarkdown = require('to-markdown');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Exstatic' });
});



router.get('/tomd', function(req, res, next){
  var temp = '';
  if (req.query.thestr) {
    temp = toMarkdown(unescape(req.query.thestr));
  }
  res.render('tomd', {text : temp});
});



router.get('/generate', function(req, res, next) {
  var wholefile = "<h2>un titre</h2><p>un text</p>";
  var filename = path.join(__dirname, '../public/static/') + 'test.html';
  fs.writeFile(filename, wholefile, function(err) {
    if (err) console.log(err);
  });
  res.redirect('/');
});

module.exports = router;
