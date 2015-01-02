var dataset = require('../datasets.json').pluto,
    fs = require('fs'),
    util = require('util'),
    events = require('events'),
    FilePrep = require('./filePrep.js'),
    parse = require('csv-parse');

var Pluto = function() {
  this.dataset = dataset;
  this.path = './files/' + dataset.tag + '/';
  this.ready = false;
};

util.inherits(Pluto, events.EventEmitter);

Pluto.prototype.init= function() {
  var self = this;

  var filePrep = new FilePrep(this.dataset);
  filePrep.on('done', function() {
    self.ready = true;
    self.emit('ready');
  });
  filePrep.on('error', function(err) {
    self.emit('error', err);
  })
  filePrep.start();
};

Pluto.prototype.read = function() {
  if (!this.ready) {
    self.emit('error', { message: 'Dataset not ready' });
    return;
  }
  var fileName = this.path + 'MN.csv';
  var file = fs.createReadStream(fileName);

  var parser = parse({
    columns: function(r) { return r; },
    auto_parse: true
  });
  var count = 0;
  parser.on('readable', function() {
    while(record = parser.read()) {
      count++;
      //console.log(JSON.stringify(record));
    }
  });
  parser.on('error', function(err) {
    console.log(err.message);
  });
  parser.on('finish', function() {
    console.log('finished. ' + count + ' records.');
  });

  file.pipe(parser)
};

module.exports = new Pluto();