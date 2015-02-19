node-nyc-bytes
==============

A node.js module for working with NYC's [BYTES of the BIG APPLE datasets](http://www.nyc.gov/html/dcp/html/bytes/applbyte.shtml). 

`nyc-bytes` automatically downloads, extracts, and exposes a stream of objects from any of the supported datasets. Most datasets return object representations of the records. MapPluto returns GeoJSON `Polygons` converted from New York - Long Island State Plane Coordinate System (NAD83) to standard Latitude/Longitude (WGS84) for easy mapping use.

### Currently Supported Datasets
* PLUTO
* MapPluto
* NYC Zoning Tax Lot Database
* PAD (Property Address Directory)

#Usage

    npm install nyc-bytes

Each dataset is exposed as a singleton object that must be initialized. This ensures that the underlying files are downloaded, extracted, and ready for use. Attach a `ready` listener to continue execution once the dataset has finished initializing.

    var Bytes = require('nyc-bytes');

    var dataset = Bytes.Pluto;
    dataset.on('ready', function() {
      console.log('Dataset ready.');
      //do something
    });
    dataset.on('error', function(err) {
      console.log('Error: ' + err.message);
    });
    dataset.init();

#####Datasets
* Pluto - `var dataset = Bytes.Pluto;`
* MapPluto - `var dataset = Bytes.MapPluto;` (requires [ogr2ogr](http://trac.osgeo.org/gdal/wiki/DownloadingGdalBinaries))
* NYC Zoning Tax Lot Database - `var dataset = Bytes.ZoningTaxLot;`
* PAD (Property Address Directory) - `var dataset = Bytes.PAD;`

##dataset.stream([options])

The dataset's underlying data is accessable like any other standard node stream.

    var stream = dataset.stream();
    stream.on('readable', function() {
      var record = stream.read();
      // do something with the record
    });
    stream.on('end', function() {
      console.log('finished');
    });

You can also use the stream in [flowing mode](http://nodejs.org/api/stream.html#stream_event_data) by attaching a `data` event listener.

    var stream = dataset.stream();
    stream.on('data', function(record) {
      // do something with the record
    });
    stream.on('end', function() {
      console.log('finished');
    });

Lastly, you can also pipe the stream like you would any other readable stream.

    var stream = dataset.stream();
    var writableStream = somehowGetWritableStream();
    stream.pipe(writableStream);

##options

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

#Test
Ensure you have [`mocha`](http://mochajs.org/) installed, then run

    npm test

to verify the datasets.

#Todo
* Add datasets - open an issue to suggest a dataset you'd like to see.