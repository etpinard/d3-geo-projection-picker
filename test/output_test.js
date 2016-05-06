var path = require('path');
var fs = require('fs');

var test = require('tap').test;

var _module = require('../');

var pathToExpect = path.join(__dirname, './expectations');
var pathToSrc = path.join(path.dirname(require.resolve('d3-geo-projection')), 'src');
var pathToOrig = path.join(__dirname, './originals');
var patchList = ['index.js', 'start.js', 'end.js'];
var ENC = 'utf-8';


function testResult(t, list, fileName) {
    t.plan(1 + patchList.length);

    var pathToExpectFile = path.join(pathToExpect, fileName + '.js');
    var result;

    _module(list, function(err, res) { result = res; });

    // need a big timeout so that d3.geo-projection bundle file in
    // node_modules/de-geo-projection/ is reset before each test run.
    setTimeout(function () {
        var expect = fs.readFileSync(pathToExpectFile, ENC);

        t.equal(result + '\n', expect, fileName);

        patchList.forEach(function(name) {
            var src = fs.readFileSync(path.join(pathToSrc, name), ENC);
            var orig = fs.readFileSync(path.join(pathToOrig, name), ENC);

            t.equal(src, orig);
        });
    }, 5000);
}

test('robinson', function(t) {
    testResult(t, ['robinson'], 'robinson');
});

test('robinson + miller', function(t) {
    testResult(t, ['robinson', 'miller'], 'robinson+miller');
});

test('plotly.js v1.x.x', function(t) {
    testResult(t, [
        'eckert4', 'hammer', 'kavrayskiy7', 'miller', 'mollweide',
        'natural-earth', 'robinson', 'sinusoidal'
        ],
        'plotly-projections'
    );
});

test('plotly.js v1.11.x and up', function(t) {
    testResult(t, [
        'eckert4', 'hammer', 'kavrayskiy7', 'miller', 'mollweide',
        'natural-earth', 'robinson', 'sinusoidal', 'winkel3'
        ],
        'plotly-projections2'
    );
});
