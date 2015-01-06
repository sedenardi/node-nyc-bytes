var dataset = require('../datasets.json').Pluto,
    util = require('util'),
    fs = require('fs'),
    Dataset = require('./dataset.js'),
    parse = require('csv-parse'),
    ss = require('stream-stream');

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

  var combined = ss({objectMode: true});

  var addToStream = function(borough) {
    var fileName = self.path + borough + '.csv';
    var file = fs.createReadStream(fileName);
    var parser = parse({
      columns: function(r) { return r; },
      auto_parse: false
    });
    var pStream = file.pipe(parser);
    combined.write(pStream);
  };

  for (var i = 0; i < boroughs.length; i++) {
    addToStream(boroughs[i]);
  }
  combined.end();

  return combined;
};

module.exports = new Pluto();