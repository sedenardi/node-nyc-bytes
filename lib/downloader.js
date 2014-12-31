var http = require('http'),
    fs = require('fs'),
    util = require('util'),
    events = require('events');

var defaultPath = './files/';

var Downloader = function(url, path) {
  this.url = url;
  this.path = (path || defaultPath);

  var parts = url.split('/');
  this.fileName = this.path + parts[parts.length-1];
};

util.inherits(Downloader, events.EventEmitter);

Downloader.prototype.download = function() {
  var self = this;
  
  var file = fs.createWriteStream(self.fileName, { flags: 'w' });
  file.on('error', function(err) {
    self.emit('error', err);
  });
  file.on('open', function() {
    var request = http.get(self.url, function(res) {
      console.log('downloading');
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

Downloader.prototype.start = function() {
  var self = this;

  fs.mkdir(this.path, function(err) {
    if (err) {
      if (err.code !== 'EEXIST') {
        self.emit('error', err);
        return;
      }
    }
    self.download();
  });
};

module.exports = Downloader;