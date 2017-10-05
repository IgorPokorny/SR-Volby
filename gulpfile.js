var gulp = require('gulp'),
    mustache = require("gulp-mustache"),
    fs = require('fs'),
    formatter = require('./formatter.js')

gulp.task('default', ['template'])

gulp.task('watch', ['template'], function() {
  gulp.watch('src/*', ['template']);
})

gulp.task('template', function() {
    var data = JSON.parse(fs.readFileSync('./src/election-results.json'))
    prepareResultsParliament(data)
    prepareResultsPresident(data)
    prepareResultsParliamentEu(data) 
    return gulp.src('./src/sr-volby.html')
        .pipe(mustache(data))
        .pipe(gulp.dest('.'))
})

/** Prepare election results for passing to the template:
 *   - compute missing values
 *   - format numbers
 */
function prepareResultsParliament(results) {
    for(var i = 0; i < results.parliament.length; i++) {      
        var parties = results.parliament[i].parties
        results.parliament[i].turnout = formatter.formatNumber(results.parliament[i].turnout)
        results.parliament[i].turnout_p = formatter.formatNumber(results.parliament[i].turnout_p, 0, 2)
        for (var j = 0; j < parties.length; j++) {
            var percents = parties[j].votes_p
            var chart = percents * 2.5
            parties[j].chart_width = chart
            // parties[j].elected = percents >= 5
            if (percents < 5) {
                parties[j].elected = false
            } else {
                parties[j].elected = true
            }
        }
        formatColumn(parties, 'seats', 0)
        formatColumn(parties, 'votes', 0)
        formatColumn(parties, 'votes_p', 2)
    }
}

function formatColumn(data, column, fractionLength) {
    var maximum = data[0][column]
    var integerLength = Math.trunc(Math.log10(maximum) + 1)
    for (var i = 0; i < data.length; i++) {
        data[i][column] = formatter.formatNumber(
            data[i][column], integerLength, fractionLength)
    }
}

function prepareResultsPresident(results) {
    for(var i = 0; i < results.president.length; i++) {
        var roundFirst = results.president[i].round1
        var candidates = roundFirst.candidates
        roundFirst.turnout = formatter.formatNumber(roundFirst.turnout)
        roundFirst.turnout_p = formatter.formatNumber(roundFirst.turnout_p, 0, 2)
        for (var j = 0; j < candidates.length; j++) {
            var percents = candidates[j].votes_p
            var chart = percents * 2
            candidates[j].chart_width = chart
            candidates[j].elected = j < 2
        }
        formatColumn(candidates, 'votes_p', 2)
        formatColumn(candidates, 'votes', 0)

        var roundSecond = results.president[i].round2
        var candidates = roundSecond.candidates
        roundSecond.turnout = formatter.formatNumber(roundSecond.turnout)
        roundSecond.turnout_p = formatter.formatNumber(roundSecond.turnout_p, 0, 2)
        for (var j = 0; j < candidates.length; j++) {
            var percents = candidates[j].votes_p
            var chart = percents * 2
            candidates[j].votes_p = formatter.formatNumber(percents, 2, 2)
            candidates[j].chart_width = chart
            candidates[j].elected = j == 0
        }
        formatColumn(candidates, 'votes', 0)
    }
    return results
}

function prepareResultsParliamentEu(results) {
    for(var i = 0; i < results.parliament_eu.length; i++) {      
        var parties = results.parliament_eu[i].parties
        results.parliament_eu[i].turnout = formatter.formatNumber(results.parliament_eu[i].turnout)
        results.parliament_eu[i].turnout_p = formatter.formatNumber(results.parliament_eu[i].turnout_p, 0, 2)
        for (var j = 0; j < parties.length; j++) {
            var percents = parties[j].votes_p
            var chart = percents * 2
            parties[j].chart_width = chart
            // parties[j].elected = percents >= 5
            if (percents < 5) {
                parties[j].elected = false
            } else {
                parties[j].elected = true
            }
        }
        formatColumn(parties, 'seats', 0)
        formatColumn(parties, 'votes', 0)
        formatColumn(parties, 'votes_p', 2)
    }
    
}

