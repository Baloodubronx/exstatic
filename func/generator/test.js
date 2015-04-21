var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');
var fs = require('fs');
var glob = require('glob');
var marked = require('marked');

function previewFromPost(post) {
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
  final = final.replace(/\{\{style-file\}\}/gm, 'styles.css');

  // categories list
  final = final.replace(/\{\{categories\}\}/gm, replaceCat);

  // INSERT page title
  final = final.replace(/\{\{title\}\}/g, post.title);

  // INSERT content
  final = final.replace(/\{\{content\}\}/g, marked(post.content));



  console.log(final);
  fs.writeFileSync('public/temp/'+post.slug+'.html', final);
}

function replaceCat() {
  var cats = ['Agriculture', 'Santé', 'Pollution', 'Melon'];
  var temp = '<ul class="cat-list">';

  cats.forEach(function(cat) {
    temp += '<li class="cat-list-item">' + cat +'</li>';
  });

  temp += '</ul>';
  return temp;
}

var onepost = {title:'the post title', content: '# the post content \n\r##the sub section \n\r I\'m having a lot of fun', slug:'one-post-title'};
previewFromPost(onepost);
