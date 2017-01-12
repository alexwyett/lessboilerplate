var gulp = require('gulp'),
  less = require('gulp-less'),
  del = require('del'),
  server = require('gulp-server-livereload'),
  concat = require('gulp-concat'),
  runSequence = require('run-sequence'),
  autoprefixer = require('gulp-autoprefixer'),
  notify = require('gulp-notify'),
  plumber = require('gulp-plumber');

gulp.task('build-clean', function () {
  return del(['dist']);
});

gulp.task('less', function() {
  return gulp.src('src/less/main.less')
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")
      })
    ).pipe(
      less({
        compress: false,
        plugins: [ require('less-plugin-glob') ]
      })
    ).pipe(autoprefixer({
        browsers: ['last 2 versions', 'safari 5', 'ie 8', 'ie 9']
      })
    ).pipe(gulp.dest('dist/css'));
});

gulp.task('copyIndex', function() {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('copyFav', function() {
  return gulp.src('src/favicon/*')
    .pipe(gulp.dest('dist/favicon'));
});

gulp.task('copyImages', function() {
  return gulp.src('src/images/*')
    .pipe(gulp.dest('dist/images'));
});

gulp.task('copyJs', function() {
  return gulp.src('src/js/main.js')
    .pipe(gulp.dest('dist/js'));
});

gulp.task('copyJquery', function() {
  return gulp.src('./node_modules/jquery/dist/*')
    .pipe(gulp.dest('dist/js/jquery'));
});

gulp.task('copyReset', function() {
  return gulp.src('./node_modules/reset-css/reset.css')
    .pipe(gulp.dest('dist/css'));
});

gulp.task('devJs', function () {
  return gulp.src('temp/js/main.js')
    .pipe(gulp.dest('dist/js'));
});

gulp.task('watch', function() {
  gulp.watch('src/index.html', ['copyIndex']);
  gulp.watch('src/less/**', ['less']);
  gulp.watch('src/js/*.js', ['copyJs']);
  gulp.watch('src/images/*', ['copyImages']);
});

gulp.task('server', function() {
  return gulp.src('dist')
    .pipe(server({
      livereload: true,
      open: true
    }));
});

gulp.task('dev', function () {
  runSequence(
    'build-clean',
    'copyJquery',
    'copyReset',
    'copyJs',
    'devJs',
    'copyIndex',
    'copyImages',
    'less',
    'server',
    'watch'
  );
});

gulp.task('default', ['dev']);

gulp.task('production', function (callback) {
  runSequence(
    'build-clean',
    'copyIndex',
    'copyFav',
    'less',
    'copyJs',
    'copyJquery',
    'copyReset',
    callback
  );
});
