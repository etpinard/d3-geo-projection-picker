var path = require('path');
var fs = require('fs');

var test = require('tap').test;

var _module = require('../');

var pathToBuild = path.join(__dirname, '../build');
var pathToExpect = path.join(__dirname, './expect');
var pathToSrc = path.join(path.dirname(require.resolve('d3-geo-projection')), 'src');
var pathToOrig = path.join(__dirname, './orig');

var patchList = ['index.js', 'start.js', 'end.js'];
var ENC = 'utf-8';


function testResult(t, list, fileName) {
    t.plan(1 + patchList.length);

    var pathToResultFile = path.join(pathToBuild, fileName);
    var pathToExpectFile = path.join(pathToExpect, fileName);

    _module(list, pathToResultFile);

    setTimeout(function () {
        var result  = fs.readFileSync(pathToResultFile, ENC);
        var expect = fs.readFileSync(pathToExpectFile, ENC);

        t.equal(result, expect, fileName);

        patchList.forEach(function(name) {
            var src = fs.readFileSync(path.join(pathToSrc, name), ENC);
            var orig = fs.readFileSync(path.join(pathToOrig, name), ENC);

            t.equal(src, orig);
        });
    }, 1500);
}

test('robinson', function(t) {
    testResult(t, ['robinson'], 'robinson.js');
});

test('robinson + miller', function(t) {
    testResult(t, ['robinson', 'miller'], 'robinson+miller.js');
});

test('plotly.js v1.x.x', function(t) {
    testResult(t, [
        'eckert4', 'hammer', 'kavrayskiy7', 'miller', 'mollweide',
        'natural-earth', 'robinson', 'sinusoidal'
        ],
        'plotly-projections.js'
    );
});
