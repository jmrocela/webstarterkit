require('dotenv').config();
var gulp = require('gulp');
var ext_replace = require('gulp-ext-replace');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var wrap = require('gulp-wrap');
var rename = require('gulp-rename');

gulp.task('styles', function() {
  let source = gulp.src('./resources/scss/*.scss')
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: process.env.NODE_ENV === 'production' ? 'compressed': 'expanded'
    }).on('error', sass.logError));

  if (process.env.NODE_ENV === 'production') {
    source
      .pipe(rename(function(path) {
        path.basename += ".min";
      }));
  }

  source.pipe(gulp.dest('./resources/public/dist/'));
});

gulp.task('locales', function() {
  gulp.src('./resources/locale/*.json')
    .pipe(wrap('window.__localeMessages = <%= contents %>;', {}, { parse: false }))
    .pipe(ext_replace('.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./resources/public/dist/locales'));
});

gulp.task('assets', function() {
  gulp.src('./resources/assets/**/*')
    .pipe(gulp.dest('./resources/public'));
});

gulp.task('watch',function() {
  gulp.watch('./resources/scss/*.scss', ['styles']);
});

gulp.task('default', [ 'styles', 'locales', 'assets' ]);