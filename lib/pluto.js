const dataset = require('../datasets.json').Pluto;
const fs = require('fs');
const path = require('path');
const Dataset = require('./Dataset.js');
const parse = require('csv-parse');
const StreamConcat = require('stream-concat');

class Pluto extends Dataset {
  constructor() {
    super(dataset);
  }
  stream(options) {
    super.stream();
    let boroughs = this.boroughIndex;
    if (options && typeof options.boroughs !== 'undefined') {
      boroughs = options.boroughs;
    }
    let boroughIndex = 0;
    const files = Object.keys(this.dataset.files);
    const combined = new StreamConcat(() => {
      if (boroughIndex === boroughs.length) return null;

      const borough = boroughs[boroughIndex++];
      const fileName = files.filter((f) => { return f.indexOf(borough) !== -1; })[0];
      const filePath = path.resolve(this.path, fileName);
      const file = fs.createReadStream(filePath);
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
