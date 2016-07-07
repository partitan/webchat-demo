'use strict';

var gulp = require('gulp');

gulp.task('movedist', function(){
    return gulp.src("public/**/*")
              .pipe(gulp.dest("./dist/"));
});

gulp.task('cdnify', ['movedist'], function () {

  var cdnify = require('gulp-cdnify');

  return gulp.src([
    'dist/**/*.{css,html}'
  ])
    .pipe(cdnify({
      base: process.env.CDN_URL
    }))
    .pipe(gulp.dest('dist/'))
});
