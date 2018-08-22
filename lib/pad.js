const dataset = require('../datasets.json').PAD;
const fs = require('fs');
const path = require('path');
const Dataset = require('./Dataset.js');
const parse = require('csv-parse');
const StreamConcat = require('stream-concat');
const Transform = require('stream').Transform;

const trimAll = function(obj) {
  for (let f in obj) {
    obj[f] = obj[f].trim();
  }
};
const replaceWhitespace = function(obj) {
  for (let f in obj) {
    obj[f] = obj[f].replace(/\s{2,}/g, ' ');
  }
};

class PAD extends Dataset {
  constructor() {
    super(dataset);
  }
  stream(options) {
    super.stream();

    let boroughs = this.boroughIndex;
    let table = 'BOTH';
    let sanitize = true;
    if (options) {
      if (typeof options.boroughs !== 'undefined')
        boroughs = options.boroughs;
      if (typeof options.table !== 'undefined' && (options.table === 'BBL' || options.table === 'ADR'))
        table = options.table;
      if (typeof options.sanitize !== 'undefined')
        sanitize = options.sanitize;
    }

    const fileArray = [];
    if (table === 'BOTH' || table === 'BBL') fileArray.push('bbl');
    if (table === 'BOTH' || table === 'ADR') fileArray.push('adr');

    let fileIndex = 0;
    const files = Object.keys(this.dataset.files);
    const combined = new StreamConcat(() => {
      if (fileIndex === fileArray.length) return null;

      const f = fileArray[fileIndex++];
      const fileName = files.filter((file) => { return file.indexOf(f) !== -1; })[0];
      const fileStream = fs.createReadStream(path.resolve(this.path, fileName));
      const csv = parse({
        columns: (r) => { return r; },
        auto_parse: false
      });
      return fileStream.pipe(csv);
    }, { objectMode: true });
    const self = this;
    const bblTransform = new Transform({
      objectMode: true,
      transform(chunk, encoding, done) {
        if (boroughs.length < 5) {
          const bIndex = parseInt(chunk.boro, 10) - 1;
          const boroughCode = self.boroughIndex[bIndex];
          const valid = boroughs.reduce((res, v) => {
            return res || v === boroughCode;
          }, false);
          if (!valid) return done();
        }

        const borough = chunk.boro + '';
        const block = self.padWithZeros(chunk.block, 5);
        const lot = self.padWithZeros(chunk.lot, 4);
        chunk.BBL = `${borough}${block}${lot}`;

        if (sanitize) {
          trimAll(chunk);
          replaceWhitespace(chunk);
        }

        this.push(chunk);
        done();
      }
    });
    return combined.pipe(bblTransform);
  }
}

module.exports = new PAD();
