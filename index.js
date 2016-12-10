const rollup = require('rollup')
const nodeResolve = require('rollup-plugin-node-resolve')
const convert = require('./convert')

const FAKE_PLUGIN_NAME = 'd3-geo-projection-picker'
const FAKE_ENTRY = 'FAKE-ENTRY'
const PKG = 'd3-geo-projection'
const PKG_SRC = PKG + '/src'

// Some useful references:
//
// - https://github.com/rollup/rollup/issues/762
// - https://github.com/rollup/rollup-plugin-multi-entry/blob/master/index.js
// - https://gist.github.com/Spy-Seth/f09120e6609c40a198f3bff56984a211
// - https://github.com/rollup/rollup/wiki/JavaScript-API
// - http://bl.ocks.org/mbostock/bb09af4c39c79cffcde4
// - https://github.com/d3/d3-geo-projection/blob/master/index.js
// - https://developer.mozilla.org/en/docs/web/javascript/reference/statements/export

/**
 * Projection picker
 *
 * @param {Array} projList
 *  list of projections to be included in output:
 *   - items can either projection names or d3 projection method name,
 *   - if projList is empty, all projections of the d3-geo-projection module
 *     will be included.
 *
 * @param {Object} opts
 *  code generation option passed to rollup, see full list at:
 *    https://github.com/rollup/rollup/wiki/JavaScript-API#bundlegenerate-options
 *
 * @param {function} cb
 *  callback function of the rollup
 *    - code generation error and
 *    - code output
 */
module.exports = function (projList, opts, cb) {
  rollup.rollup({

    // the bundle's starting point.
    entry: FAKE_ENTRY,

    plugins: [
      makeFakePlugin(projList),

      // make sure third party modules are resolved correctly
      nodeResolve({ jsnext: true })
    ]

  })
  .then((bundle) => {
    var result = bundle.generate(opts)

    cb(null, result.code)
  })
  .catch(cb)
}

function makeFakePlugin (projList) {
  var plugin = {}

  plugin.name = FAKE_PLUGIN_NAME

  plugin.resolveId = (id) => {
    if (id === FAKE_ENTRY) return FAKE_ENTRY
  }

  plugin.load = (id) => {
    if (id === FAKE_ENTRY) return makeFakeEntry(projList)
  }

  return plugin
}

function makeFakeEntry (projList) {
  if (projList.length > 0) {
    return projList.map((item) => {
      var method = convert.item2method(item)
      var name = convert.item2name(item)

      return `export { default as ${method} } from "${PKG_SRC}/${name}"`
    })
    .join('\n')
  } else {
    return `export * from "${PKG}"`
  }
}
