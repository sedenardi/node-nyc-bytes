/* global before */
/* global it */
/* global describe */

const assert = require('assert');
const TestStream = require('./testStream.js');

const boroughTest = function(dataset, streamOptions, tsRecords, tsFunction, count) {
  let testData = {};
  before(function(done) {
    this.timeout(0);
    const stream = dataset.stream(streamOptions);
    const testStream = new TestStream({ objectMode: true }, tsRecords, tsFunction);
    testStream.on('finish', function() {
      testData = this.testData();
      done();
    });
    stream.pipe(testStream);
  });
  it('Record count matches', () => {
    assert.equal(testData.count, count, `Actual count is ${testData.count}`);
  });
  it('Specified records exist', function() {
    assert.equal(1, testData.recordsMissing.length, `Missing records: ${testData.recordsMissing.filter((r) => r !== 'fake').join(', ')}`);
  });
};

module.exports.allTests = function(dataset, options, records, bblFunction, counts, allOnly, noInit) {
  if (typeof noInit === 'undefined' || !noInit) {
    before(function(done) {
      this.timeout(0);
      dataset.init().then(() => {
        done();
      }).catch((err) => {
        done(err);
      });
    });
  }
  if (!allOnly) {
    describe('Individual boroughs', () => {
      describe('Manhattan', () => {
        const opt = { boroughs: ['MN'] };
        for (let k in options)
          opt[k] = options[k];
        boroughTest(dataset, opt, records.MN, bblFunction, counts.MN);
      });
      describe('Bronx', () => {
        const opt = { boroughs: ['BX'] };
        for (let k in options)
          opt[k] = options[k];
        boroughTest(dataset, opt, records.BX, bblFunction, counts.BX);
      });
      describe('Brooklyn', () => {
        const opt = { boroughs: ['BK'] };
        for (let k in options)
          opt[k] = options[k];
        boroughTest(dataset, opt, records.BK, bblFunction, counts.BK);
      });
      describe('Queens', () => {
        const opt = { boroughs: ['QN'] };
        for (let k in options)
          opt[k] = options[k];
        boroughTest(dataset, opt, records.QN, bblFunction, counts.QN);
      });
      describe('Staten Island', () => {
        const opt = { boroughs: ['SI'] };
        for (let k in options)
          opt[k] = options[k];
        boroughTest(dataset, opt, records.SI, bblFunction, counts.SI);
      });
    });
  } else {
    describe('All boroughs', () => {
      const opt = { };
      for (let k in options)
        opt[k] = options[k];
      const allRecords = [
        ...records.MN,
        ...records.BX,
        ...records.BK,
        ...records.QN,
        ...records.SI
      ];
      const totalCount = counts.Total;
      boroughTest(dataset, opt, allRecords, bblFunction, totalCount);
    });
  }
};
