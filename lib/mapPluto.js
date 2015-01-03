var dataset = require('../datasets.json').MapPluto,
    fs = require('fs'),
    util = require('util'),
    events = require('events'),
    FilePrep = require('./filePrep.js');

var MapPluto = function() {
  this.dataset = dataset;
  this.path = __dirname + '/../files/' + dataset.tag + '/';
  this.ready = false;
};

util.inherits(MapPluto, events.EventEmitter);

MapPluto.prototype.init= function() {
  var self = this;

  var filePrep = new FilePrep(self.dataset, self.path);
  filePrep.on('done', function() {
    self.ready = true;
    self.emit('ready');
  });
  filePrep.on('error', function(err) {
    self.emit('error', err);
  })
  filePrep.start();
};

MapPluto.prototype.stream = function(boroughs) {
  
};

module.exports = new MapPluto();