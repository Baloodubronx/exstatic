var myCodeMirror = {};

$(document).ready(function() {

  myCodeMirror = CodeMirror.fromTextArea(document.getElementById('textarea'), {lineWrapping:true});

  $('#savebutton').click(function(){
    var url = '/api/post/save';
    var post = {};
    if (typeof postID !== 'undefined') {
      url = '/api/post/'+postID;
    }

    post.title = $('#posttitleinput').val();
    post.slug = $('#postslug').val();
    post.content = myCodeMirror.getValue();
    $.post(url, {post:post, tags:tags}).done(function(data) {
      console.log(data.post.slug);
      var redirect = '/post/'+data.post.slug;
      $( location ).attr("href", redirect);
    });
    //console.log(myCodeMirror.getValue());
  });

  generateTags();

  $('#newtag').keypress(function(e) {
    if(e.which === 13) {
      tags.push({'name':$('#newtag').val()});
      $('#newtag').val('');
      generateTags();
    }
  });

  $('#makeslug').click(function(){
    var name = $('#posttitleinput').val();
    $('#postslug').val('loading...');
    $.post('/api/makeslug', {name:name}).done(function(data){
      $('#postslug').val(data.slug);
    });
  });

});


function generateTags() {
  $('#tagzone').html('');
  tags.forEach(function(item){
    $('#tagzone').append('<p>'+item.name+'</p>');
  });
}
