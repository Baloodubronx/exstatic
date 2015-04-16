var http = require('http');
var fs = require('fs');
var mkdirp = require('mkdirp');

exports.importMedia = function(url, media) {
  var link = url+'media/'+media;
  var str = '';

  var getRequest = http.get(link, function(response) {
		response.on('data', function (chunk) {
			str += chunk;
		});
		response.on('end', function () {
      str=unescape(str);
			var json=JSON.parse(str);


      var d = new Date(json.date);
      var month = d.getMonth()+1 < 10 ? '0'+(d.getMonth()+1) : d.getMonth()+1;
      var dir = '../temp/media/' + d.getFullYear() + '/' + month+'/';

      mkdirp(dir, function(){
        var filename = json.guid.replace(/^.*[\\\/]/g, '');
        var file = fs.createWriteStream(dir+filename);
        var request =
        http.get(json.guid, function(response) {
          response.pipe(file);
        });
      });
		});
	});

	getRequest.on('error', function (err) {
		console.log(err);
	});
};
