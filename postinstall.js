var path = require('path');
var exec = require('child_process').exec;

var pathToModule = path.dirname(require.resolve('d3-geo-projection'));

exec('cd ' + pathToModule + ' && npm install smash uglify-js', function(err) {
    if(err) throw err;
});
