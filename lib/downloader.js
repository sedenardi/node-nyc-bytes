const fs = require('fs');
const request = require('request');

module.exports = {
  get: function(url, path) {
    return new Promise((resolve, reject) => {
      const dest = fs.createWriteStream(path);
      dest.on('close', () => { resolve(); });
      dest.on('error', (err) => { reject(err); });
      request(url).pipe(dest);
    });
  }
};
