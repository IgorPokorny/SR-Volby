var gulp = require('gulp'),
    mustache = require("gulp-mustache")

gulp.task('default', ['template'])

gulp.task('watch', function() {
  gulp.watch('src/*', ['template']);
})

gulp.task('template', function() {
  return gulp.src('./src/sr-volby.html')
    .pipe(mustache('./src/election-results.json'))
    .pipe(gulp.dest('.'))
})


