var dataset = require('../datasets.json').MapPluto,
    fs = require('fs'),
    util = require('util'),
    events = require('events'),
    FilePrep = require('./filePrep.js'),
    DBF = require('stream-dbf'),
    ss = require('stream-stream');

var MapPluto = function() {
  this.dataset = dataset;
  this.path = __dirname + '/../files/' + dataset.tag + '/';
  this.ready = false;

  this.files = {
    MN: 'Manhattan/MNMapPLUTO.dbf',
    BX: 'Bronx/BXMapPLUTO.dbf',
    BK: 'Brooklyn/BKMapPLUTO.dbf',
    QN: 'Queens/QNMapPLUTO.dbf',
    SI: 'Staten_Island/SIMapPLUTO.dbf'
  };
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
  });
  filePrep.start();
};

MapPluto.prototype.stream = function(boroughs) {
  var self = this;
  if (!self.ready) {
    self.emit('error', { message: 'Dataset not ready' });
    return;
  }

  if (!boroughs || boroughs.constructor !== Array)
    boroughs = ['MN','BX','BK','QN','SI'];

  var combined = ss({objectMode: true});

  var addToStream = function(borough) {
    var fileName = self.path + self.files[borough];
    combined.write((new DBF(fileName)).stream);
  };

  for (var i = 0; i < boroughs.length; i++) {
    addToStream(boroughs[i]);
  }
  combined.end();

  return combined;
};

module.exports = new MapPluto();