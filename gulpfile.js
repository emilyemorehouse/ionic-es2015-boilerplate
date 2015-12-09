var babelify= require('babelify');
var bower = require('bower');
var browserify = require('browserify');
var del = require('del');
var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var ngAnnotate = require('gulp-ng-annotate');
var plumber = require("gulp-plumber");
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var sh = require('shelljs');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');



var paths = {
  sass: ['./src/scss/**/*.scss'],
  es6: ['./src/js/**/*.js']
};
var isDevelopment = true;

gulp.task('default', ['sass', 'browserify']);

gulp.task('sass', function(done) {
  gulp.src('./src/scss/ionic.app.scss')
    .pipe(plumber())
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

//Browserify
gulp.task('browserify',function(){
  return browserify({
    entries:'./src/js/app.js',
    debug: (isDevelopment?true:false),
    transform: [["babelify", { "presets": ["es2015"] } ]]
  })
  .bundle()
  .pipe(source('./bundle.js'))
  .pipe(buffer())
  .pipe(ngAnnotate())
  .pipe(gulp.dest('./www/js'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.es6, ['browserify']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('clean', function(){
  del([
    './www/js/**/*'
  ]);
});
