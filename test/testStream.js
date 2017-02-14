var Writable = require('stream').Writable,
    util = require('util');

var TestStream = function() {
  Writable.call(this, {objectMode: true});
  this.count = 0;
};

util.inherits(TestStream, Writable);

TestStream.prototype._write = function(chunk, encoding, callback) {
  this.count++;
  callback();
};

TestStream.prototype.testData = function() {
  return { count: this.count };
};

module.exports = TestStream;
