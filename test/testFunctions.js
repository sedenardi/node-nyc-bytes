var assert = require('assert'),
    TestStream = require('./testStream.js');

var boroughTest = function(dataset, streamOptions, count) {
  var testData = {};
  before(function(done) {
    this.timeout(0);
    var stream = dataset.stream(streamOptions);
    var testStream = new TestStream();
    testStream.on('finish', function() {
      testData = this.testData();
      done();
    });
    stream.pipe(testStream);
  });
  it('Record count matches', function() {
    assert.equal(count, testData.count);
  });
};

module.exports.allTests = function(dataset, options, counts, allOnly, noInit) {
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
        boroughTest(dataset, opt, counts.MN);
      });
      describe('Bronx', function() {
        var opt = { boroughs: ['BX'] };
        for (var k in options)
          opt[k] = options[k];
        boroughTest(dataset, opt, counts.BX);
      });
      describe('Brooklyn', function() {
        var opt = { boroughs: ['BK'] };
        for (var k in options)
          opt[k] = options[k];
        boroughTest(dataset, opt, counts.BK);
      });
      describe('Queens', function() {
        var opt = { boroughs: ['QN'] };
        for (var k in options)
          opt[k] = options[k];
        boroughTest(dataset, opt, counts.QN);
      });
      describe('Staten Island', function() {
        var opt = { boroughs: ['SI'] };
        for (var k in options)
          opt[k] = options[k];
        boroughTest(dataset, opt, counts.SI);
      });
    });
  } else {
    describe('All boroughs', function() {
      var opt = { };
      for (var k in options)
        opt[k] = options[k];
      var totalCount = counts.Total;
      boroughTest(dataset, opt, totalCount);
    });
  }
};
