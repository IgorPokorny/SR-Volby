var gulp = require('gulp'),
    mustache = require("gulp-mustache"),
    fs = require('fs'),
    formatter = require('./formatter.js')

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
            parties[j].chart_width = chart
            // parties[j].elected = percents >= 5
            if (percents < 5) {
                parties[j].elected = false
            } else {
                parties[j].elected = true
            }
        }
        formatColumn(parties, 'seats')
        formatColumn(parties, 'votes')
        formatColumn(parties, 'votes_p', 2)
    } 
    return results
}

function formatColumn(data, column, fractionLength=0) {
    var maximum = data[0][column]
    var integerLength = Math.trunc(Math.log10(maximum) + 1)
    for (var i = 0; i < data.length; i++) {
        data[i][column] = formatter.formatNumber(
            data[i][column], integerLength, fractionLength)
    }
}
