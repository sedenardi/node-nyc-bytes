var dataset = require('../datasets.json').pluto,
    util = require('util'),
    events = require('events'),
    Downloader = require('./downloader.js');

var Pluto = function() {
  this.dataset = dataset;
};

util.inherits(Pluto, events.EventEmitter);

Pluto.prototype.init= function() {
  var self = this;

  var downloader = new Downloader(this.dataset.url);
  downloader.on('done', function() {
    self.emit('done');
  });
  downloader.on('error', function(err) {
    self.emit('error', err);
  });
  downloader.start();
};

module.exports = new Pluto();