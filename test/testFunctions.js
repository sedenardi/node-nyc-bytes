/* global before */
/* global it */
/* global describe */

const assert = require('assert');
const TestStream = require('./testStream.js');

const boroughTest = function(dataset, streamOptions, count) {
  let testData = {};
  before(function(done) {
    this.timeout(0);
    const stream = dataset.stream(streamOptions);
    const testStream = new TestStream({ objectMode: true });
    testStream.on('finish', function() {
      testData = this.testData();
      done();
    });
    stream.pipe(testStream);
  });
  it('Record count matches', () => {
    assert.equal(testData.count, count);
  });
};

module.exports.allTests = function(dataset, options, counts, allOnly, noInit) {
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
        boroughTest(dataset, opt, counts.MN);
      });
      describe('Bronx', () => {
        const opt = { boroughs: ['BX'] };
        for (let k in options)
          opt[k] = options[k];
        boroughTest(dataset, opt, counts.BX);
      });
      describe('Brooklyn', () => {
        const opt = { boroughs: ['BK'] };
        for (let k in options)
          opt[k] = options[k];
        boroughTest(dataset, opt, counts.BK);
      });
      describe('Queens', () => {
        const opt = { boroughs: ['QN'] };
        for (let k in options)
          opt[k] = options[k];
        boroughTest(dataset, opt, counts.QN);
      });
      describe('Staten Island', () => {
        const opt = { boroughs: ['SI'] };
        for (let k in options)
          opt[k] = options[k];
        boroughTest(dataset, opt, counts.SI);
      });
    });
  } else {
    describe('All boroughs', () => {
      const opt = { };
      for (let k in options)
        opt[k] = options[k];
      var totalCount = counts.Total;
      boroughTest(dataset, opt, totalCount);
    });
  }
};
