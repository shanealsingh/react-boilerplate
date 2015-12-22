var gulp = require('gulp'),
    path = require('path'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    less = require('gulp-less-sourcemap');
    connect = require('gulp-connect');

// Setup server
gulp.task('connect', function() {
  connect.server({
    root: './www',
    port: 9000,
    livereload: true
  });
});

// Convert ES6 -> ES5
gulp.task('jsx-js', function () {
  return browserify({
    entries: './src/jsx/app.jsx',
    extensions: ['.jsx'],
    debug: true
  })
  .transform('babelify', { presets: ['es2015', 'react'] })
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./www/assets/js'))
  .pipe(connect.reload());
});

// Compile Less
gulp.task('less', function () {
  return gulp.src('./src/less/styles.less')
    .pipe(less())
    .pipe(gulp.dest('./www/assets/css'))
    .pipe(connect.reload());
});

// Watch for changes
gulp.task('watch', ['jsx-js'], function () {
  gulp.watch('./src/**/*.jsx', ['jsx-js']);
  gulp.watch('./src/**/*.less', ['less']);
  gulp.watch('./www/**/*.html', function() {
    return gulp.src('./www/**/*.html')
      .pipe(connect.reload());
  });
});


gulp.task('build', ['jsx-js', 'less']);
gulp.task('default', ['jsx-js', 'less', 'connect', 'watch']);

