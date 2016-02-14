var path = require('path');

var test = require('tap').test;

var cases = {
    robinson: require('./cases/robinson'),
    'robinson+miller': require('./cases/robinson+miller'),
    'plotly-projections': require('./cases/plotly-projections')
};


function testResult(t, list, fileName) {
    t.plan(list.length);

    var _module = cases[fileName];

    list.forEach(function(proj) {
        t.type(_module.geo[proj], 'function');
    });
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
        'naturalEarth', 'robinson', 'sinusoidal'
        ],
        'plotly-projections'
    );
});
