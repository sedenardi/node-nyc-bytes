var assert = require('assert'),
    TestStream = require('./testStream.js');

var boroughTest = function(dataset, streamOptions, tsRecords, tsFunction, count) {
  var testData = {};
  before(function(done) {
    this.timeout(0);
    var stream = dataset.stream(streamOptions);
    var testStream = new TestStream(tsRecords, tsFunction);
    testStream.on('finish', function() {
      testData = this.testData();
      done();
    });
    stream.pipe(testStream);
  });
  it('Record count matches', function() {
    assert.equal(count, testData.count);
  });
  it('Specified records exist', function() {
    assert.equal(0, testData.recordsMissing.length);
  });
};

module.exports.allTests = function(dataset, options, indexFunction, records, counts, allOnly, noInit) {
  if (typeof noInit === 'undefined' || !noInit) {
    before(function(done) {
      this.timeout(0);
      dataset.on('ready', done);
      dataset.on('error', done);
      dataset.init();
    });
  }
  if (!allOnly) {
    describe('Individual boroughs', function() {
      describe('Manhattan', function() {
        var opt = { boroughs: ['MN'] };
        for (var k in options)
          opt[k] = options[k];
        boroughTest(dataset, opt, records.MN, indexFunction, counts.MN);
      });
      describe('Bronx', function() {
        var opt = { boroughs: ['BX'] };
        for (var k in options)
          opt[k] = options[k];
        boroughTest(dataset, opt, records.BX, indexFunction, counts.BX);
      });
      describe('Brooklyn', function() {
        var opt = { boroughs: ['BK'] };
        for (var k in options)
          opt[k] = options[k];
        boroughTest(dataset, opt, records.BK, indexFunction, counts.BK);
      });
      describe('Queens', function() {
        var opt = { boroughs: ['QN'] };
        for (var k in options)
          opt[k] = options[k];
        boroughTest(dataset, opt, records.QN, indexFunction, counts.QN);
      });
      describe('Staten Island', function() {
        var opt = { boroughs: ['SI'] };
        for (var k in options)
          opt[k] = options[k];
        boroughTest(dataset, opt, records.SI, indexFunction, counts.SI);
      });
    });
  }
  describe('All boroughs', function() {
    var opt = { };
    for (var k in options)
      opt[k] = options[k];
    var allRecords = records.MN
      .concat(records.BX)
      .concat(records.BK)
      .concat(records.QN)
      .concat(records.SI);
    var totalCount = counts.MN + counts.BX + counts.BK + counts.QN + counts.SI;
    boroughTest(dataset, opt, allRecords, indexFunction, totalCount);
  });
};