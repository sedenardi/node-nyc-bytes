const dataset = require('../datasets.json').MapPluto;
const path = require('path');
const Dataset = require('./Dataset.js');
const ogr2ogr = require('ogr2ogr');
const Transform = require('stream').Transform;

class MapTransform extends Transform {
  constructor(options) {
    super(options);
    this.buf = '';
  }
  readBuffer() {
    const start = this.buf.indexOf('{ "type": "Feature"');
    const end = this.buf.indexOf('] ] } }');
    if (start > -1 && end > -1) {
      const newObj = JSON.parse(this.buf.substring(start, end + 7));
      newObj.properties.BBL = parseInt(newObj.properties.BBL.toString().split('.')[0]);
      this.buf = this.buf.substring(end + 7);
      return newObj;
    } else {
      return null;
    }
  }
  _transform(chunk, encoding, done) {
    this.buf += chunk.toString();
    let newObj = this.readBuffer();
    while (newObj) {
      this.push(newObj);
      newObj = this.readBuffer();
    }
    done();
  }
  _flush(done) {
    let newObj = this.readBuffer();
    while (newObj) {
      this.push(newObj);
      newObj = this.readBuffer();
    }
    done();
  }
}

class MapPluto extends Dataset {
  constructor() {
    super(dataset);
  }
  stream() {
    super.stream();
    const filePath = path.resolve(this.path, this.dataset.files[0]);
    const ogr2 = ogr2ogr(filePath).timeout(6000000).options(['-t_srs', 'crs:84']);
    const stream = ogr2.stream();
    const transform = new MapTransform({ readableObjectMode: true });
    return stream.pipe(transform);
  }
}

module.exports = new MapPluto();
