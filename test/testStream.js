'use strict';

const Writable = require('stream').Writable;

class TestStream extends Writable {
  constructor(options) {
    super(options);
    this.count = 0;
  }
  _write(chunk, encoding, done) {
    this.count++;
    done();
  }
  testData() {
    return { count: this.count };
  }
}

module.exports = TestStream;
