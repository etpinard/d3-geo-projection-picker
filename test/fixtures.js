const fs = require('fs')
const path = require('path')
const world = require('world-atlas/world/110m.json')

module.exports = {
  body: '<body><svg width="500" height="500"></svg></body>',
  opts: { format: 'umd', moduleName: 'd3' },

  world: world,
  d3Src: loadD3(),
  topojsonSrc: loadTopojson(),

  pathLength: 5045,
  fullSize: 189917,

  cases: [{
    list: ['robinson'],
    size: '13.2 kB'
  }, {
    list: ['robinson', 'miller'],
    size: '13.3 kB'
  }, {
    list: ['geoRobinson', 'geoMiller', 'winkel3'],
    size: '14.2 kB'
  }, {
    list: [
      'eckert4', 'hammer', 'kavrayskiy7', 'miller', 'mollweide',
      'natural-earth', 'robinson', 'sinusoidal', 'winkel3'
    ],
    size: '15.2 kB'
  }]
}

function loadD3 () {
  return fs.readFileSync(
    path.join(require.resolve('d3'), '..', 'd3.js'),
   'utf-8'
  )
}

function loadTopojson () {
  return fs.readFileSync(
    path.join(require.resolve('topojson-client')),
   'utf-8'
  )
}
