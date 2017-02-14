const dataset = require('../datasets.json').Pluto;
const fs = require('fs');
const Dataset = require('./Dataset_N.js');
const parse = require('csv-parse');
const StreamConcat = require('stream-concat');

class Pluto extends Dataset {
  constructor() {
    super(dataset);
  }
  stream(options) {
    if (!this.ready) {
      throw new Error('Dataset not ready.');
    }
    let boroughs = self.boroughIndex;
    if (options && typeof options.boroughs !== 'undefined') {
      boroughs = options.boroughs;
    }
    let boroughIndex = 0;
    const combined = new StreamConcat(() => {
      if (boroughIndex === boroughs.length) { return null; }

      const borough = boroughs[boroughIndex++];
      const fileName = `${self.filePath}${borough}.csv`;
      const file = fs.createReadStream(fileName);
      const parser = parse({
        columns: (r) => { return r; },
        auto_parse: false
      });
      return file.pipe(parser);
    }, { objectMode: true });
    return combined;
  }
}

module.exports = new Pluto();
