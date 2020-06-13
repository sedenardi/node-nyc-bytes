const Writable = require('stream').Writable;

class TestStream extends Writable {
  constructor(options, testRecords, bblFunction) {
    super(options);
    this.count = 0;
    this.testRecords = new Set(testRecords);
    this.bblFunction = bblFunction;
  }
  _write(chunk, encoding, done) {
    this.count++;
    const bbl = this.bblFunction(chunk);
    this.testRecords.delete(bbl);
    done();
  }
  testData() {
    return {
      count: this.count,
      recordsMissing: Array.from(this.testRecords)
    };
  }
}

module.exports = TestStream;
