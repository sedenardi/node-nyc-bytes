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
  stream() {
    super.stream();
    let fileIndex = 0;
    const combined = new StreamConcat(() => {
      if (fileIndex === this.dataset.files.length) return null;

      const fileName = this.dataset.files[fileIndex++];
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
