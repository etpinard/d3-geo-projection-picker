const d3 = require('d3')
const topojson = require('topojson-client')
const winkel3 = require('./winkel3')

const context = d3.select('body')
  .append('canvas')
  .attr('width', 1000)
  .attr('height', 700)
  .node()
  .getContext('2d')

const path = d3.geoPath()
  .projection(winkel3.geoWinkel3())
  .context(context)

d3.json('https://d3js.org/world-110m.v1.json', (err, world) => {
  if (err) throw err

  context.beginPath()
  path(topojson.mesh(world))
  context.stroke()

  context.beginPath()
  path({ type: 'Sphere' })
  context.stroke()
})
