var dataset = require('../datasets.json').Pluto,
    util = require('util'),
    fs = require('fs'),
    Dataset = require('./dataset.js'),
    parse = require('csv-parse'),
    StreamConcat = require('stream-concat');

var Pluto = function() {
  Pluto.super_.call(this);
  this.dataset = dataset;
  this.path = __dirname + '/../files/' + dataset.tag + '/';
};

util.inherits(Pluto, Dataset);

Pluto.prototype.stream = function(options) {
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
    var fileName = self.path + borough + '.csv';
    var file = fs.createReadStream(fileName);
    var parser = parse({
      columns: function(r) { return r; },
      auto_parse: false
    });
    return file.pipe(parser);
  };

  var combined = new StreamConcat(nextStream, {objectMode: true});

  return combined;
};

module.exports = new Pluto();