// gulpfile.js
const gulp = require("gulp");
const sass = require("gulp-sass");

// a task to generate the css with sass
gulp.task('css', function() {
  return gulp.src('./src/scss/main.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    })
    .on('error', sass.logError))
    .pipe(gulp.dest('./src/site/_includes/css'));
});