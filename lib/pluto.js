var dataset = require('../datasets.json').Pluto,
    fs = require('fs'),
    util = require('util'),
    events = require('events'),
    FilePrep = require('./filePrep.js'),
    parse = require('csv-parse'),
    ss = require('stream-stream');

var Pluto = function() {
  this.dataset = dataset;
  this.path = __dirname + '/../files/' + dataset.tag + '/';
  this.ready = false;
};

util.inherits(Pluto, events.EventEmitter);

Pluto.prototype.init= function() {
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

Pluto.prototype.stream = function(boroughs) {
  var self = this;
  if (!self.ready) {
    self.emit('error', { message: 'Dataset not ready' });
    return;
  }

  if (!boroughs || boroughs.constructor !== Array)
    boroughs = ['MN','BX','BK','QN','SI'];

  var combined = ss({objectMode: true});

  var addToStream = function(borough) {
    var fileName = self.path + borough + '.csv';
    var file = fs.createReadStream(fileName);
    var parser = parse({
      columns: function(r) { return r; },
      auto_parse: true
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