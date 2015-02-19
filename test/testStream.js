var Writable = require('stream').Writable,
    util = require('util');

var TestStream = function(testRecords,indexFunction) {
  Writable.call(this, {objectMode: true});
  this.count = 0;
  this.testRecords = testRecords;
  this.testRecordsExist = Array.apply(null,new Array(this.testRecords.length))
    .map(function() {
      return false;
    });
  this.indexFunction = indexFunction;
};

util.inherits(TestStream, Writable);

TestStream.prototype._write = function(chunk, encoding, callback) {
  this.count++;
  var index = this.indexFunction(chunk, this.testRecords);
  if (index > -1 && index < this.testRecords.length)
    this.testRecordsExist[index] = true;
  callback();
};

TestStream.prototype.testData = function() {
  var self = this;
  var recordsMissing = this.testRecordsExist.map(function(v,i) {
    return v ? '' : self.testRecords[i];
  }).filter(function(v,i) {
    return v.length;
  });
  return {
    count: this.count,
    recordsMissing: recordsMissing
  };
};

module.exports = TestStream;