var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  livereload = require('gulp-livereload'),
  stylus = require('gulp-stylus'),
  concat = require('gulp-concat');

gulp.task('stylus', function () {
  gulp.src('./public/css/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  gulp.watch('./public/css/**/*.styl', ['stylus']);
  gulp.watch('./theme/stylus/**/*.styl', ['theme-stylus']);
});

gulp.task('theme-stylus', function(){
  gulp.src('./theme/stylus/**/*.styl')
  .pipe(stylus())
  .pipe(concat('style.css'))
  .pipe(gulp.dest('./theme'))
  .pipe(gulp.dest('./site/temp'))
  .pipe(livereload());
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js coffee jade',
  }).on('restart', function () {
    setTimeout(function () {
      livereload.changed(__dirname);
    }, 1000);
  });
});

gulp.task('default', [
  'stylus',
  'theme-stylus',
  'develop',
  'watch'
]);
