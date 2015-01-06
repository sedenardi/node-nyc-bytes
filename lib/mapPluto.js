var dataset = require('../datasets.json').MapPluto,
    util = require('util'),
    fs = require('fs'),
    Dataset = require('./dataset.js'),
    DBF = require('stream-dbf'),
    ss = require('stream-stream');

var MapPluto = function() {
  this.dataset = dataset;
  this.path = __dirname + '/../files/' + dataset.tag + '/';

  this.files = {
    MN: 'Manhattan/MNMapPLUTO.dbf',
    BX: 'Bronx/BXMapPLUTO.dbf',
    BK: 'Brooklyn/BKMapPLUTO.dbf',
    QN: 'Queens/QNMapPLUTO.dbf',
    SI: 'Staten_Island/SIMapPLUTO.dbf'
  };
};

util.inherits(MapPluto, Dataset);

MapPluto.prototype.stream = function(boroughs) {
  var self = this;
  if (!self.ready) {
    self.emit('error', { message: 'Dataset not ready' });
    return;
  }

  if (!boroughs || boroughs.constructor !== Array)
    boroughs = self.boroughIndex;

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