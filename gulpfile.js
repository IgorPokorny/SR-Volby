var gulp = require('gulp'),
    mustache = require("gulp-mustache"),
    fs = require('fs')

gulp.task('default', ['html'])

gulp.task('watch', function() {
  gulp.watch('src/*', ['html']);
})

gulp.task('html', function() {
  var data = JSON.parse(fs.readFileSync('./src/election-results.json'))
  var preparedData = prepareResults(data)
  return gulp.src('./src/sr-volby.html')
    .pipe(mustache(preparedData))
    .pipe(gulp.dest('.'))
})

/** Prepare election results for passing to the template:
 *   - compute missing values
 *   - format numbers
 */
function prepareResults(results) {
    return results  // TODO: Implement processing
}
