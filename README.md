# d3-geo-projection-picker

Hand picked d3 geo projections.

If you find yourself wanting more projections than the stock `d3.geo`
[list](https://github.com/mbostock/d3/wiki/Geo-Projections) while feeling that
the d3 geo projection [module](https://github.com/d3/d3-geo-projection) is too
extensive for your needs, `d3-geo-projection-picker` is a tool that could help
you find a middle ground.

### Install

```bash
# for CLI use:
npm install -g d3-geo-projection-picker

# for API use:
npm install d3-geo-projection-picker
```

### Usage

First, generated a *projection module* using either the CLI or the API.

Using the CLI:

```bash
d3-geo-projection-picker proj1 proj2 proj3 > output.js

# or
d3-geo-projection-picker proj1 proj2 proj3 -o output.js

# or
d3-geo-projection-picker proj1 proj2 proj3 --output output.js
```

where `proj1`, `proj2`, `proj3` are the names of the projection (as found
[here](https://github.com/mbostock/d3/wiki/Geo-Projections)) to included in the
out file.

Using the API:

```js
var fs = require('fs');
var picker = require('d3-geo-projection-picker');

picker(['proj1', 'proj2', 'proj3'], function(err, result) {
    fs.writeFileSync(pathToOutput, result);
});
```

Then, pass `d3` to the projection module:

```js
var d3 = require('d3');
var addProjectionsToD3 = require('./path/to/projection_module');

addProjectionsToD3(d3);

// now 'd3' has all
```

and finally bundle the result and use `d3.geo[/* projection name */]` as you
would using the full `d3-geo-projection` module.

### Credits

2016 Étienne Tétreault-Pinard. MIT License
