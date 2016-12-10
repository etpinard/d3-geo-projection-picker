const camelCase = require('camelcase')

// See
//
// https://github.com/d3/d3-geo-projection/blob/master/index.js
//
// the following handle all projections found in
//
// https://github.com/d3/d3-geo-projection/tree/master/src
//
// N.B. interrupted, polyhedral and quincuncial projections
// are not supported at the moment.

exports.item2method = function (item) {
  return 'geo' + capitalize(camelCase(strip(item)))
}

exports.item2name = function (item) {
  return camelCase(strip(item))
}

function strip (s) {
  var ss = String(s).trim()

  return ss.substring(0, 3) === 'geo'
    ? ss.slice(3)
    : ss
}

function capitalize (s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
