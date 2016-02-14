#!/usr/bin/env node
var fs = require('fs');
var parseArg = require('minimist');
var picker = require('./');

var argv = parseArg(process.argv.slice(2), {
    string: 'output',
    alias: { output: 'o' }
});

/**
 * Usage:
 *
 * node d3-geo-projection-picker proj1 proj2 proj3 > file.js
 * node d3-geo-projection-picker proj1 proj2 proj3 -o file.js
 * node d3-geo-projection-picker proj1 proj2 proj3 --output file.js
 *
 */
picker(argv._, function(err, result) {
    if(err) throw err;

    if(argv.o) {
        fs.writeFileSync(argv.o, result);
    }
    else {
        process.stdout.write(result + '\n');
    }
});
