var fs = require('fs'),
    util = require('util'),
    events = require('events'),
    mkdirp = require('mkdirp'),
    DecompressZip = require('decompress-zip'),
    Downloader = require('./downloader.js');

var FilePrep = function(dataset, path) {
  this.dataset = dataset;
  this.path = path;

  var parts = this.dataset.url.split('/');
  this.fileName = parts[parts.length-1];
};

util.inherits(FilePrep, events.EventEmitter);

FilePrep.prototype.start = function() {
  var self = this;

  mkdirp(self.path, function(err) {
    if (err) {
      self.emit('error', err);
      return;
    }
    self.checkDir();
  });
};

FilePrep.prototype.checkDir = function() {
  var self = this;
  fs.readdir(self.path, function(err, files) {
    if (err) {
      self.emit('error', err);
      return;
    }

    if (!files.length) {
      self.download();
    } else {
      var zipExists = false;
      for (var i = 0; i < files.length; i++) {
        zipExists = zipExists || files[i] === self.fileName;
      }

      if (zipExists) {
        if (files.length > 1)
          self.emit('done');
        else
          self.extract();
      } else {
        self.download();
      }
    }
  });
};

FilePrep.prototype.download = function() {
  var self = this;

  var downloader = new Downloader(this.dataset.url, this.path);
  downloader.on('done', function() {
    self.extract();
  });
  downloader.on('error', function(err) {
    self.emit('error', err);
  });
  downloader.start();
};

FilePrep.prototype.extract = function() {
  var self = this;
  
  var unzipper = new DecompressZip(self.path + self.fileName);
  unzipper.on('extract', function(log) {
    self.emit('done');
  });
  unzipper.on('error', function(err) {
    self.emit('error', err);
  });
  console.log('Extracting dataset.')
  unzipper.extract({
    path: self.path
  });
};

module.exports = FilePrep;