module.exports.formatNumber = formatNumber

function formatNumber(number, integerLength=0, fractionLength=0) {
    var result = number.toFixed(fractionLength).replace('.', ',')
    result = padWithSpaces(result, integerLength, fractionLength)
    result = insertGroupSeparators(result, fractionLength)
    result = result.replace(/ /g, '&#8199;') // Figure spaces
    return result
}

function padWithSpaces(numberStr, integerLength=0, fractionLength=0) {
    var paddingLength = integerLength - numberStr.length
    if (fractionLength > 0) {
        paddingLength += 1 + fractionLength
    }
    if (paddingLength > 0) {
        return ' '.repeat(paddingLength) + numberStr
    } else {
        return numberStr
    }
}

function insertGroupSeparators(numberStr, fractionLength) {
    var firstGroupLength = 3
    if (fractionLength > 0) {
        firstGroupLength += 1 + fractionLength
    }
    var result = numberStr.slice(-firstGroupLength)
    var rest = numberStr.slice(0, -firstGroupLength)
    while (rest.length > 0) {
        result = rest.slice(-3) + '&thinsp;' + result
        rest = rest.slice(0, -3)
    }
    return result
}

/*** Testing ****************************************************************/
function testFormatNumber() {
    var assert = require('assert')
    assert.strictEqual(formatNumber(1), '1')
    assert.strictEqual(formatNumber(1.5), '2')
    assert.strictEqual(formatNumber(1, 0, 2), '1,00')
    assert.strictEqual(formatNumber(1.125, 0, 2), '1,13')
    assert.strictEqual(formatNumber(1000), '1&thinsp;000')
    assert.strictEqual(formatNumber(100000), '100&thinsp;000')
    assert.strictEqual(formatNumber(1000000), '1&thinsp;000&thinsp;000')
    assert.strictEqual(formatNumber(1, 3), '&#8199;&#8199;1')
    assert.strictEqual(formatNumber(1, 4), '&#8199;&thinsp;&#8199;&#8199;1')
    assert.strictEqual(formatNumber(10000.5, 7, 2),
                       '&#8199;&thinsp;&#8199;10&thinsp;000,50')
}

if (require.main === module) {
    testFormatNumber()
}
