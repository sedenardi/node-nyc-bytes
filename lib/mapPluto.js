var dataset = require('../datasets.json').MapPluto,
    util = require('util'),
    fs = require('fs'),
    Dataset = require('./dataset.js'),
    ogr2ogr = require('ogr2ogr'),
    StreamConcat = require('stream-concat'),
    Transform = require('stream').Transform;

var MapPluto = function() {
  MapPluto.super_.call(this, dataset);

  this.files = dataset.files;
};

util.inherits(MapPluto, Dataset);

var MapTransform = function() {
  Transform.call(this,{readableObjectMode: true});
  this.buf = '';
};

util.inherits(MapTransform, Transform);

MapTransform.prototype._readBuffer = function() {
  var start = this.buf.indexOf('{ "type": "Feature"'),
      end = this.buf.indexOf('] ] } }');
  if (start > -1 && end > -1) {
    var newObj = JSON.parse(this.buf.substring(start,end+7));
    newObj.properties.BBL = parseInt(newObj.properties.BBL.toString().split('.')[0]);
    this.buf = this.buf.substring(end+7);
    return newObj;
  } else {
    return null;
  }
};

MapTransform.prototype._transform = function(chunk, encoding, callback) {
  this.buf += chunk.toString();
  var newObj = this._readBuffer();
  while (newObj) {
    this.push(newObj);
    newObj = this._readBuffer();
  }
  callback();
};

MapTransform.prototype._flush = function(callback) {
  var newObj = this._readBuffer();
  while (newObj) {
    this.push(newObj);
    newObj = this._readBuffer();
  }
  callback();
};

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
    var ogr2 = ogr2ogr(fileName).timeout(6000000).options(['-t_srs','crs:84']);
    var stream = ogr2.stream();
    var transform = new MapTransform();
    return stream.pipe(transform);
  };

  var combined = new StreamConcat(nextStream, {objectMode: true});

  return combined;
};

module.exports = new MapPluto();