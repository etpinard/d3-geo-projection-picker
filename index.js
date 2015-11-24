var path = require('path');
var readline = require('readline');
var exec = require('child_process').exec;

var fs = require('fs-extra');

var pathToModule = path.dirname(require.resolve('d3-geo-projection'));
var pathToSrcFolder = path.join(pathToModule, 'src');
var pathToBuildFolder = path.join(__dirname, './build');
var pathToSrcIndex = path.join(pathToSrcFolder, 'index.js');
var pathToSrcIndexOrig = path.join(pathToBuildFolder, 'index.js.orig');
var pathToSrcIndexBuild = path.join(pathToBuildFolder, 'index.js');
var pathToSrcStart = path.join(pathToSrcFolder, 'start.js');
var pathToSrcStartOrig = path.join(pathToBuildFolder, 'start.js.orig');
var pathToSrcEnd = path.join(pathToSrcFolder, 'end.js');
var pathToSrcEndOrig = path.join(pathToBuildFolder, 'end.js.orig');
var pathToBundle = path.join(pathToModule, 'd3.geo.projection.js');
var pathToBundleOrig = path.join(pathToBuildFolder, 'd3.geo.projection.js.orig');
var pathToBundleBuild = path.join(pathToBuildFolder, 'd3.geo.projection.js');

var START = 'function addProjectionToD3() {';
var END = '}\n' + 'module.exports = addProjectionToD3;\n';
var REQUIRED = ['start', 'end', 'project', 'interrupt'];
var MAKE = 'make d3.geo.projection.js';

/**
 * pick and bundle d3.geo.projection file
 *
 * @param {array} list
 *      list of projection name to include
 * @param {string} outPath
 *      output path of bundled d3.geo.projection file
 *
 */
module.exports = function picker(list, outPath) {

    // make copy of original files
    fs.copySync(pathToSrcStart, pathToSrcStartOrig);
    fs.copySync(pathToSrcEnd, pathToSrcEndOrig);
    fs.copySync(pathToSrcIndex, pathToSrcIndexOrig);
    fs.copySync(pathToBundle, pathToBundleOrig);

    // write up patched 'start' and 'end' files
    fs.writeFileSync(pathToSrcStart, START);
    fs.writeFileSync(pathToSrcEnd, END);

    // read 'index' line-by-line and comment projection not part of 'list'
    var rl = readline.createInterface({
        input: fs.createReadStream(pathToSrcIndex)
    });
    var wStream = fs.createWriteStream(pathToSrcIndexBuild);

    rl.on('line', function(line) {
        var projection = line.split('import "')[1].split('";')[0];

        if(REQUIRED.concat(list).indexOf(projection) !== -1) {
            wStream.write(line + '\n');
        }
    });

    // once patched index is done
    rl.on('close', function() {

        // copy patched 'index' file
        fs.copySync(pathToSrcIndexBuild, pathToSrcIndex);

        // exec make command
        exec('cd ' + pathToModule + ' && ' + MAKE, function(err) {
            if(err) {
                copyBackOriginalFiles();
                throw err;
            }

            // copy bundle to build/ + copy back original files
            fs.copy(pathToBundle, pathToBundleBuild, function(err) {
                if(err) {
                    copyBackOriginalFiles();
                    throw err;
                }
                copyBackOriginalFiles();

                // output to outPath
                var outStream = (typeof outPath === 'string') ?
                        fs.createWriteStream(outPath) :
                        outPath;
                fs.createReadStream(pathToBundleBuild).pipe(outStream);
            });
        });
    });
};

// copy back original files
function copyBackOriginalFiles() {
    fs.copySync(pathToSrcStartOrig, pathToSrcStart);
    fs.copySync(pathToSrcEndOrig, pathToSrcEnd);
    fs.copySync(pathToSrcIndexOrig, pathToSrcIndex);
    fs.copySync(pathToBundleOrig, pathToBundle);
}
