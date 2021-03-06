var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
//var posts = require('./routes/posts');
//var importer = require('./routes/importer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(require('connect-livereload')());
app.use('/', routes);
//app.use('/posts', posts);
//app.use('/importer', importer);

// MONGODB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/exstatic');

var http = require('http');
app.set('port', 3000);

var server = http.createServer(app);

server.listen(3000, function(){
  console.log('Express server listening on 3000, in dev mode');
});
