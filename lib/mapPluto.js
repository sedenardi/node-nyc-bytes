var dataset = require('../datasets.json').MapPluto,
    util = require('util'),
    fs = require('fs'),
    Dataset = require('./dataset.js'),
    DBF = require('stream-dbf'),
    StreamConcat = require('stream-concat');

var MapPluto = function() {
  MapPluto.super_.call(this);
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

MapPluto.prototype.stream = function(options) {
  var self = this;
  if (!self.ready) {
    self.emit('error', { message: 'Dataset not ready' });
    return;
  }

  var boroughs = self.boroughIndex;

  if (options) {
    if (typeof options.boroughs !== 'undefined')
      boroughs = options.boroughs;
  }

  var boroughIndex = 0;
  var nextStream = function() {
    if (boroughIndex === boroughs.length)
      return null;

    var borough = boroughs[boroughIndex++];
    var fileName = self.path + self.files[borough];
    return (new DBF(fileName)).stream;
  };

  var combined = new StreamConcat(nextStream, {objectMode: true});

  return combined;
};

module.exports = new MapPluto();