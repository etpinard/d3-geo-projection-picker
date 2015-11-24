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
picker(argv._, argv.o || process.stdout);
