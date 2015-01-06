var dataset = require('../datasets.json').PAD,
    util = require('util'),
    fs = require('fs'),
    Dataset = require('./dataset.js'),
    parse = require('csv-parse'),
    stream = require('stream'),
    ss = require('stream-stream');

var PAD = function() {
  this.dataset = dataset;
  this.path = __dirname + '/../files/' + dataset.tag + '/';

  this.fileNames = {
    BBL: 'bobabbl.txt',
    ADR: 'bobaadr.txt'
  };
};

util.inherits(PAD, Dataset);

PAD.prototype.stream = function(boroughs, table) {
  var self = this;
  if (!self.ready) {
    self.emit('error', { message: 'Dataset not ready' });
    return;
  }

  if (!boroughs || boroughs.constructor !== Array)
    boroughs = self.boroughIndex;

  var trimAll = function(obj) {
    for (var f in obj) {
      obj[f] = obj[f].trim();
    }
  };
  var replaceWhitespace = function(obj) {
    for (var f in obj) {
      obj[f] = obj[f].replace(/\s{2,}/g, ' ');
    }
  };

  var combined = ss({objectMode: true});

  if (!table || table === 'BBL') {
    var bblFile = fs.createReadStream(this.path + this.fileNames.BBL);
    var bblParser = parse({
      columns: function(r) { return r; },
      auto_parse: false
    });
    combined.write(bblFile.pipe(bblParser));
  }
  if (!table || table === 'ADR') {
    var adrFile = fs.createReadStream(this.path + this.fileNames.ADR);
    var adrParser = parse({
      columns: function(r) { return r; },
      auto_parse: false
    });
    combined.write(adrFile.pipe(adrParser));
  }
  combined.end();

  var bblTransform = new stream.Transform({objectMode: true});
  bblTransform._transform = function(chunk, encoding, done) {
    if (boroughs.length < 5) {
      var bIndex = parseInt(chunk.boro,10) - 1;
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

    var borough = chunk.boro + '';
    var block = self.padWithZeros(chunk.block,5);
    var lot = self.padWithZeros(chunk.lot,4);
    chunk.BBL = borough + block + lot;

    trimAll(chunk);
    replaceWhitespace(chunk);

    this.push(chunk);
    done();
  };
  return combined.pipe(bblTransform);
};

module.exports = new PAD();