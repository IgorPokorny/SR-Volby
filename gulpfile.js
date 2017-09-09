

var gulp = require('gulp'),
    mustache = require("gulp-mustache"),
    fs = require('fs')

gulp.task('default', ['template'])

gulp.task('watch', function() {
  gulp.watch('src/*', ['template']);
})

gulp.task('template', function() {
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
    for(var i = 0; i < results.parliament.length; i++) {      
        var parties = results.parliament[i].parties
        for (var j = 0; j < parties.length; j++) {
            var percents = parties[j].votes_p
            var chart = percents * 4
            parties[j].votes_p = formatNumber(percents)
            parties[j].chart_width = chart
            // parties[j].elected = percents >= 5
            if (percents < 5) {
                parties[j].elected = false
            } else {
                parties[j].elected = true
            }
        }
    } 
    return results
}

function formatNumber(number) {
    return number.toLocaleString('sk', { useGrouping: true, minimumFractionDigits: 2 })
}

