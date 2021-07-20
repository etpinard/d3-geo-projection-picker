# d3-geo-projection-picker

[![npm version](https://badge.fury.io/js/d3-geo-projection-picker.svg)](https://badge.fury.io/js/d3-geo-projection-picker)

[![Build Status](https://travis-ci.org/etpinard/d3-geo-projection-picker.svg?branch=master)](https://travis-ci.org/etpinard/d3-geo-projection-picker)
[![Coverage](https://coveralls.io/repos/github/etpinard/d3-geo-projection-picker/badge.svg?master)](https://coveralls.io/github/etpinard/d3-geo-projection-picker)

Hand picked d3 geo projections.

If you find yourself wanting more projections than the stock `d3.geo`
[list](https://github.com/d3/d3-geo#projections) and feeling that
the d3 geo projection [module](https://github.com/d3/d3-geo-projection) is too
extensive for your needs, `d3-geo-projection-picker` is a tool that could help
you find a happy middle ground.

### Install

```bash
# for CLI use:
npm install -g d3-geo-projection-picker

# for API use:
npm install d3-geo-projection-picker
```

### Usage

Say you want to use the
[Robinson](https://github.com/d3/d3-geo-projection#geoRobinson),
[Miller](https://github.com/d3/d3-geo-projection#geoMiller) and
[Winkel triplet](https://github.com/d3/d3-geo-projection#geoWinkel3)
projections, using the CLI, run:

```bash
d3-geo-projection-picker robinson miller winkel3 > projections.js

# or
d3-geo-projection-picker robinson miller winkel3 -o projections.js

# or
d3-geo-projection-picker robinson miller winkel3 --output projections.js
```

or using the API:

```js
const fs = require('fs')
const picker = require('d3-geo-projection-picker')

picker(['robinson', 'miller', 'winkel3'], { /* bundling options */ }, (err, code) => {
  fs.writeFileSync(/* path to output */, code)
})
```

By default, `d3-geo-projection-picker` outputs a CommonJS module, so then one
can [browserify](https://github.com/substack/node-browserify) the following:


```js
const d3 = require('d3')
const topojson = require('topojson-client')
const projections = require('./projections')

const context = d3.select('canvas').node().getContext('2d')

// or '.geoMiller' or '.geoWinkel3'
const projection = projections.geoRobinson()

const path = d3.geoPath()
  .projection(projection)
  .context(context)

d3.json('https://d3js.org/world-110m.v1.json', (err, world) => {
  if (err) throw err

  context.beginPath()
  path(topojson.mesh(world))
  context.stroke()
})
```

to draw a world map with the Robinson projection.

### Advanced

The picker function can bundle any combination of projections found in
`d3-geo-projection` (see full list
[here](https://github.com/d3/d3-geo-projection#projections)).

Internally, `d3-geo-projection-picker` uses
[Rollup](https://github.com/rollup/rollup). You can pass any Rollup
bundle-generation options (see full list
[here](https://github.com/rollup/rollup/wiki/JavaScript-API#bundlegenerate-options-))
to `d3-geo-projection-picker` to get the output bundle of your needs.

For example, to output a [UMD](https://github.com/umdjs/umd) bundle with
[natural earth](https://github.com/d3/d3-geo-projection#geoNaturalEarth)
projection, from the CLI:

```bash
d3-geo-projection-picker natural-earth --format umd --moduleName d3
```

or from the API

```js
const picker = require('d3-geo-projection-picker')
const opts = { format: 'umd', moduleName: 'd3' }

picker(['natural-earth'], opts, (err, code) => {})
```

See the [example](/example) folder for more details.

### Credits

2017 Étienne Tétreault-Pinard. MIT License

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
