node-nyc-bytes
==============

A node.js module for working with NYC's [BYTES of the BIG APPLE datasets](http://www.nyc.gov/html/dcp/html/bytes/applbyte.shtml).

`nyc-bytes` automatically downloads, extracts, and exposes a stream of objects from any of the supported datasets. Most datasets return object representations of the records. MapPluto returns GeoJSON `Polygons` converted from New York - Long Island State Plane Coordinate System (NAD83) to standard Latitude/Longitude (WGS84) for easy mapping use.

### Currently Supported Datasets
* PLUTO
* MapPluto (requires [ogr2ogr](http://trac.osgeo.org/gdal/wiki/DownloadingGdalBinaries))
* NYC Zoning Tax Lot Database
* PAD (Property Address Directory)

### Usage

```js
npm install nyc-bytes
```

Each dataset is exposed as a singleton object that must be initialized. This ensures that the underlying files are downloaded, extracted, and ready for use. Initializing the dataset returns a `Promise` that returns once the dataset has finished initializing.
```js
const Bytes = require('nyc-bytes');

const dataset = Bytes.Pluto;
// or const dataset = Bytes.MapPluto;
// or const dataset = Bytes.ZoningTaxLot;
// or const dataset = Bytes.PAD;
dataset.init().then(() => {
  console.log('Dataset ready.');
  const stream = dataset.stream();
  // do something with stream
}).catch((err) => {
  console.error(err);
});
```

### dataset.stream([options])

The dataset's underlying data is accessible like any other standard node stream.

```js
const stream = dataset.stream();
stream.on('readable', () => {
  const record = stream.read();
  // do something with the record
});
stream.on('end', () => {
  console.log('finished');
});
```

You can also use the stream in [flowing mode](http://nodejs.org/api/stream.html#stream_event_data) by attaching a `data` event listener.

```js
const stream = dataset.stream();
stream.on('data', (record) => {
  // do something with the record
});
stream.on('end', () => {
  console.log('finished');
});
```

Lastly, you can also pipe the stream like you would any other readable stream.

```js
const stream = dataset.stream();
const writableStream = somehowGetWritableStream();
stream.pipe(writableStream);
```

### options

* `boroughs` - default: `['MN','BX','BK','QN','SI']` - Array of boroughs to return in the stream.
* `table` - default: `'BOTH'` - Which table (`'BBL'`|`'ADR'`) to return (**only applicable to PAD dataset**)
* `sanitize` - default: `true` - Removes extra whitespaces. (**only applicable to PAD dataset**) Ex.
```
"EAST   45 STREET               "
```
becomes
```
"EAST 45 STREET"
```

## Todo
* Add datasets - open an issue to suggest a dataset you'd like to see.
