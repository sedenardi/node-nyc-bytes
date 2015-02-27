var util = require('util'),
    events = require('events'),
    FilePrep = require('./filePrep.js');

var Dataset = function(dataset) {
  this.ready = false;
  this.initializing = false;
  this.boroughIndex = ['MN','BX','BK','QN','SI'];
  this.dataset = dataset;
  this.path = __dirname + '/../files/' + dataset.tag + '-' + dataset.version + '/';
};

util.inherits(Dataset, events.EventEmitter);

Dataset.prototype.init = function() {
  var self = this;

  if (this.initializing) 
    return;
  
  this.initializing = true;
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