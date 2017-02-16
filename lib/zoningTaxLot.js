'use strict';

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
  stream(options) {
    super.stream();
    let boroughs = this.boroughIndex;
    if (options && typeof options.boroughs !== 'undefined') {
      boroughs = options.boroughs;
    }
    const files = Object.keys(this.dataset.files);
    const file = fs.createReadStream(path.resolve(this.path, files[0]));
    const parser = parse({
      columns: (r) => { return r; },
      auto_parse: false
    });
    const self = this;
    const bblTransform = new Transform({
      objectMode: true,
      transform(chunk, encoding, done) {
        if (boroughs.length < 5) {
          const bIndex = parseInt(chunk['Borough Code'], 10) - 1;
          const boroughCode = self.boroughIndex[bIndex];
          const valid = boroughs.reduce((res, v) => {
            return res || v === boroughCode;
          }, false);
          if (!valid) return done();
        }

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
