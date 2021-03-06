const dataset = require('../datasets.json').ZoningTaxLot;
const fs = require('fs');
const path = require('path');
const Dataset = require('./Dataset.js');
const parse = require('csv-parse');
const Transform = require('stream').Transform;

class ZoningTaxLot extends Dataset {
  constructor() {
    super(dataset);
  }
  stream() {
    super.stream();
    const file = fs.createReadStream(path.resolve(this.path, this.dataset.files[0]));
    const parser = parse({
      columns: (r) => { return r; },
      cast: false
    });
    const self = this;
    const bblTransform = new Transform({
      objectMode: true,
      transform(chunk, encoding, done) {
        const borough = chunk['Borough Code'] + '';
        const block = self.padWithZeros(chunk['Tax Block'], 5);
        const lot = self.padWithZeros(chunk['Tax Lot'], 4);
        chunk.BBL = `${borough}${block}${lot}`;
        this.push(chunk);
        done();
      }
    });
    return file.pipe(parser).pipe(bblTransform);
  }
}

module.exports = new ZoningTaxLot();
