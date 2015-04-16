var gulp = require('gulp'),
livereload = require('gulp-livereload'),
nodemon = require('gulp-nodemon');

gulp.task('watch',  function() {
  // start the livereload server
  livereload.listen();
  gulp.watch('server/**/*.jade', ['reload']);
  gulp.watch('server/**/*.css', ['reload']);
});

gulp.task('serve', ['watch'], function(){
  nodemon(
    {
      script: 'server/app.js',
      watch: ['server/**/*.js'],
    })
    .on('restart', function () {
      setTimeout(function() {livereload.changed();}, 1000);
      console.log('restarted2!');
    });
});

gulp.task('reload', function(){
  gulp.src('server/**/*.*').pipe(livereload());
  console.log('restarted!');
});
