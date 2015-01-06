var util = require('util'),
    events = require('events'),
    FilePrep = require('./filePrep.js');

var Dataset = function() {
  this.ready = false;
  this.boroughIndex = ['MN','BX','BK','QN','SI'];
};

util.inherits(Dataset, events.EventEmitter);

Dataset.prototype.init = function() {
  var self = this;

  var filePrep = new FilePrep(self.dataset, self.path);
  filePrep.on('done', function() {
    self.ready = true;
    self.emit('ready');
  });
  filePrep.on('error', function(err) {
    self.emit('error', err);
  });
  filePrep.start();
};

Dataset.prototype.padWithZeros = function(num, size) {
  var s = num + '';
  while (s.length < size)
    s = '0' + s;
  return s;
};

module.exports = Dataset;