var gulp = require('gulp'),
    mustache = require("gulp-mustache")

gulp.task('default', ['html'])

gulp.task('watch', function() {
  gulp.watch('src/*', ['html']);
})

gulp.task('html', function() {
  return gulp.src('./src/sr-volby.html')
    .pipe(mustache('./src/election-results.json', {}, {}))
    .pipe(gulp.dest('.'))
})