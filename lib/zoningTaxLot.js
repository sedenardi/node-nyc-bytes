var dataset = require('../datasets.json').ZoningTaxLot,
    fs = require('fs'),
    util = require('util'),
    events = require('events'),
    FilePrep = require('./filePrep.js'),
    parse = require('csv-parse'),
    stream = require('stream');

var ZoningTaxLot = function() {
  this.dataset = dataset;
  this.path = __dirname + '/../files/' + dataset.tag + '/';
  this.ready = false;

  this.fileName = 'NYC_ZoningTaxLotDB_201412.csv';
};

util.inherits(ZoningTaxLot, events.EventEmitter);

ZoningTaxLot.prototype.init= function() {
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

ZoningTaxLot.prototype.stream = function(boroughs) {
  var self = this;
  if (!self.ready) {
    self.emit('error', { message: 'Dataset not ready' });
    return;
  }

  var file = fs.createReadStream(this.path + this.fileName);
  var parser = parse({
    columns: function(r) { return r; },
    auto_parse: false
  });

  var boroughIndex = ['MN','BX','BK','QN','SI'];

  if (!boroughs || boroughs.constructor !== Array)
    boroughs = ['MN','BX','BK','QN','SI'];

  var pad = function(num, size) {
    var s = num + '';
    while (s.length < size)
      s = '0' + s;
    return s;
  };
  var bblTransform = new stream.Transform({objectMode: true});
  bblTransform._transform = function(chunk, encoding, done) {
    if (boroughs.length < 5) {
      var bIndex = parseInt(chunk['Borough Code'],10)-1;
      var boroughCode = boroughIndex[bIndex];
      var process = false;
      for (var i = 0; i < boroughs.length; i++) {
        process = process || boroughs[i] === boroughCode;
      }
      if (!process) {
        done();
        return;
      }
    }

    var borough = chunk['Borough Code'] + '';
    var block = pad(chunk['Tax Block'],5);
    var lot = pad(chunk['Tax Lot'],4);
    chunk.BBL = borough + block + lot;

    this.push(chunk);
    done();
  };
  return file.pipe(parser).pipe(bblTransform);
};

module.exports = new ZoningTaxLot();