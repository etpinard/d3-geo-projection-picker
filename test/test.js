const test = require('tap').test
const jsdom = require('jsdom')
const gzipSize = require('gzip-size')
const prettySize = require('prettysize')

const picker = require('../')
const convert = require('../convert')
const fixtures = require('./fixtures')

fixtures.cases.forEach((_case) => {
  let list = _case.list

  test(`picking list "[${list.join(', ')}]"`, (t) => {
    t.plan(1 + (3 * list.length))

    picker(list, fixtures.opts, (err, code) => {
      if (err) t.fail()

      t.equal(getSize(code), _case.size, 'should generate correct bundle size')

      run(code, (err, window) => {
        if (err) t.fail()

        const d3 = window.d3
        const topojson = window.topojson

        list.forEach((item) => {
          let method = convert.item2method(item)

          let projection = d3[method]()
          t.ok(projection, 'should attached method to d3 object')

          drawWorld(d3, topojson, projection)

          let pathGenerated = d3.select('path')
          t.equal(pathGenerated.size(), 1, 'should generate path')
          t.equal(pathGenerated.attr('d').split(',').length, fixtures.pathLength, 'should generate correct path length')
        })

        window.close()
        t.end()
      })
    })
  })
})

test('picking all projections', (t) => {
  t.plan(1)

  picker([], {}, (err, code) => {
    if (err) t.fail()

    t.equal(code.length, fixtures.fullSize, 'should generated correct bundle size')
  })
})

test('picking invalid projections', (t) => {
  t.plan(6)

  picker(['not-gonna-work'], fixtures.opts, (err, code) => {
    t.ok(err instanceof Error)
    t.type(code, 'undefined')
    t.match(err, new Error('Could not resolve \'d3-geo-projection/src/notGonnaWork\' from FAKE-ENTRY'))
  })

  picker([null], fixtures.opts, (err, code) => {
    t.ok(err instanceof Error)
    t.type(code, 'undefined')
    t.equal(String(err), 'Error: Could not resolve \'d3-geo-projection/src/null\' from FAKE-ENTRY')
  })
})

test('picking with invalid options', (t) => {
  t.plan(6)

  picker([], { format: 'not-gonna-work' }, (err, code) => {
    t.ok(err instanceof Error)
    t.type(code, 'undefined')
    t.equal(String(err), 'Error: You must specify an output type - valid options are amd, cjs, es, iife, umd')
  })

  picker([], { format: 'umd' }, (err, code) => {
    t.ok(err instanceof Error)
    t.type(code, 'undefined')
    t.equal(String(err), 'Error: You must supply options.moduleName for UMD bundles')
  })
})

function run (code, cb) {
  jsdom.env({
    html: fixtures.body,
    src: [fixtures.d3Src, fixtures.topojsonSrc, code],
    done: cb
  })
}

function drawWorld (d3, topojson, projection) {
  const world = fixtures.world
  const path = d3.geoPath().projection(projection)
  const datum = topojson.feature(world, world.objects.land)

  d3.select('svg')
    .append('path')
    .datum(datum)
    .attr('d', path)
}

function getSize (code) {
  return prettySize(gzipSize.sync(code))
}
