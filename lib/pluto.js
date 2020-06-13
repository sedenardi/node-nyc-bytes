const dataset = require('../datasets.json').Pluto;
const fs = require('fs');
const path = require('path');
const Dataset = require('./Dataset.js');
const parse = require('csv-parse');
const Transform = require('stream').Transform;

class Pluto extends Dataset {
  constructor() {
    super(dataset);
  }
  stream() {
    super.stream();
    const bblTransform = new Transform({
      objectMode: true,
      transform(chunk, encoding, done) {
        chunk.BBL = chunk.BBL || chunk.bbl;
        this.push(chunk);
        done();
      }
    });
    const filePath = path.resolve(this.path, this.dataset.files[0]);
    const file = fs.createReadStream(filePath);
    const parser = parse({
      columns: (r) => { return r; },
      auto_parse: false
    });
    return file.pipe(parser).pipe(bblTransform);
  }
}

module.exports = new Pluto();
