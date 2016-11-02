var http = require('https'),
    fs = require('fs'),
    util = require('util'),
    events = require('events');

var Downloader = function(url, path) {
  this.url = url;
  this.path = path;

  var parts = url.split('/');
  this.fileName = this.path + parts[parts.length-1];
};

util.inherits(Downloader, events.EventEmitter);

Downloader.prototype.start = function() {
  var self = this;
  var file = fs.createWriteStream(self.fileName, { flags: 'w' });
  file.on('error', function(err) {
    self.emit('error', err);
  });
  file.on('open', function() {
    var request = http.get(self.url, function(res) {
      console.log('Downloading dataset.');
      res.pipe(file);
      file.on('finish', function() {
        file.close(function() {
          self.emit('done');
        });
      });
    }).on('error', function(err) {
      fs.unlink(self.fileName);
      self.emit('error', err);
    });
  });
};

module.exports = Downloader;
