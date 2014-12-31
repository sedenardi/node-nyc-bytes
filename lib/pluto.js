var dataset = require('../datasets.json').pluto,
    fs = require('fs'),
    util = require('util'),
    events = require('events'),
    FilePrep = require('./filePrep.js');

var Pluto = function() {
  this.dataset = dataset;
};

util.inherits(Pluto, events.EventEmitter);

Pluto.prototype.init= function() {
  var self = this;

  var filePrep = new FilePrep(this.dataset);
  filePrep.on('done', function() {
    self.emit('done');
  });
  filePrep.on('error', function(err) {
    self.emit('error', err);
  })
  filePrep.start();
};

module.exports = new Pluto();