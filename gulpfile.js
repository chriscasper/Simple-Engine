// Simple Engine

// Lets require some things...
var gulp        = require('gulp'),
    data        = require('gulp-data'),
    notify      = require("gulp-notify"),
    frontMatter = require('gulp-front-matter'),
    rename      = require('gulp-rename'),
    clean       = require('gulp-clean'),
    swig        = require('gulp-swig'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    server      = require('gulp-server-livereload');

// Get our site configuration
// site.json is availible in every page so you can use some global variables
var getJsonData = function(file) {
  return require('./config.json');
};

// Generate pages for all html files in the content folder
gulp.task('content', function () {
  return gulp.src(['source/content/**/*.html'])
    .pipe(data(getJsonData))
    .pipe(swig({defaults: { cache: false }}))
    .pipe(rename(function (path) {
      // Lets do some quick modifications for generating a nice SEO structure

      if(path.dirname.length > 0 && path.basename == 'index') {
        // This scenario rewrites our public path for index files in subfolders
        path.dirname = "/" + path.dirname;
        path.basename = "index";
      }
      else if(path.dirname.length > 0) {
        // This scenario covers subfolders
        path.dirname = "/" + path.dirname + "/" + path.basename;
        path.basename = "index";
      }
      else {
        path.dirname = "/" + path.basename;
        path.basename = "index";
      }
    }))
    .pipe(gulp.dest('public'))
    .pipe(notify({ message: 'Finished compiling html'}));
});

// This way if we say a layout piece change we just re-render our content
gulp.task('layouts', function () {
    gulp.start(['content']);
});

// SASS
gulp.task('scss', function() {
  return gulp.src('source/scss/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/css'))
    .pipe(notify({ message: 'Finished compiling SASS'}));
});

// Javascript
gulp.task('js', function() {
  return gulp.src('source/js/**/*.js')
    .pipe(concat('index.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
    .pipe(notify({ message: 'Finished javascript'}));
});

// Images
gulp.task('img', function() {
  return gulp.src('source/img/**/*')
    .pipe(gulp.dest('public/img'))
    .pipe(notify({ message: 'Finished copying image'}));
});

// Fonts
gulp.task('font', function() {
  return gulp.src('source/fonts/**/*')
    .pipe(gulp.dest('public/fonts'))
    .pipe(notify({ message: 'Finished copying font'}));
});

// Watch
gulp.task('watch', function() {
  gulp.watch('source/content/**/*.html', ['content']);
  gulp.watch('source/layouts/**/*.html', ['layouts']);
  gulp.watch('source/scss/**/*.scss', ['scss']);
  gulp.watch('source/js/**/*.js', ['js']);
  gulp.watch('source/img/**/*', ['img']);
  gulp.watch('source/font/**/*', ['font']);
});

// Clean
gulp.task('clean', function() {
  return gulp.src('public')
    .pipe(clean());
});

// Start local webserver for development
gulp.task('webserver', function() {
  gulp.src('public/')
    .pipe(server({
      livereload: true,
      open: true
    }));
});

// Default Task
gulp.task('default', ['content','scss','js','img','font','watch','webserver']);

// Build for Production
gulp.task('build', ['clean'], function () {
    gulp.start(['content','scss','js','img','font']);
});
