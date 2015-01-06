var dataset = require('../datasets.json').ZoningTaxLot,
    util = require('util'),
    fs = require('fs'),
    Dataset = require('./dataset.js'),
    parse = require('csv-parse'),
    stream = require('stream');

var ZoningTaxLot = function() {
  this.dataset = dataset;
  this.path = __dirname + '/../files/' + dataset.tag + '/';

  this.fileName = 'NYC_ZoningTaxLotDB_201412.csv';
};

util.inherits(ZoningTaxLot, Dataset);

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

  if (!boroughs || boroughs.constructor !== Array)
    boroughs = self.boroughIndex;

  var bblTransform = new stream.Transform({objectMode: true});
  bblTransform._transform = function(chunk, encoding, done) {
    if (boroughs.length < 5) {
      var bIndex = parseInt(chunk['Borough Code'],10)-1;
      var boroughCode = self.boroughIndex[bIndex];
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
    var block = self.padWithZeros(chunk['Tax Block'],5);
    var lot = self.padWithZeros(chunk['Tax Lot'],4);
    chunk.BBL = borough + block + lot;

    this.push(chunk);
    done();
  };
  return file.pipe(parser).pipe(bblTransform);
};

module.exports = new ZoningTaxLot();