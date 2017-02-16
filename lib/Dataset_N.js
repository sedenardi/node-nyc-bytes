'use strict';

const path = require('path');
const FilePrep = require('./FilePrep_N.js');

class Dataset {
  constructor(dataset) {
    this.ready = false;
    this.initializing = false;
    this.boroughIndex = ['MN', 'BX', 'BK', 'QN', 'SI'];
    this.dataset = dataset;
    this.path = path.resolve(__dirname, '../files/', `${dataset.tag}-${dataset.version}/`);
  }
  init() {
    if (this.initializing) {
      throw new Error('Dataset already initializing.');
    }
    this.initializing = true;
    const filePrep = new FilePrep(this.dataset, this.path);
    return filePrep.start().then(() => {
      this.ready = true;
      return Promise.resolve();
    });
  }
  padWithZeros(num, size) {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  }
  stream() {
    if (!this.ready) {
      throw new Error('Dataset not ready.');
    }
  }
}

module.exports = Dataset;
