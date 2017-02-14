'use strict';

const yauzl = require('yauzl');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const unzip = function(filePath, rootDir) {
  return new Promise((resolve, reject) => {
    yauzl.open(filePath, { lazyEntries: true }, (err, zipfile) => {
      if (err) { return reject(err); }
      zipfile.on('error', (err) => { reject(err); });
      zipfile.on('close', () => { resolve(); });
      zipfile.on('entry', (entry) => {
        if (/\/$/.test(entry.fileName)) {
          const dest = path.resolve(rootDir, entry.fileName);
          mkdirp(dest, (err) => {
            if (err) { return reject(err); }
            zipfile.readEntry();
          });
        } else {
          zipfile.openReadStream(entry, (err, readStream) => {
            if (err) { return reject(err); }
            const dest = path.resolve(rootDir, entry.fileName);
            mkdirp(path.dirname(dest), (err) => {
              if (err) { return reject(err); }
              readStream.on('end', () => { zipfile.readEntry(); });
              readStream.pipe(fs.createWriteStream(dest));
            });
          });
        }
      });
      zipfile.readEntry();
    });
  });
};

module.exports = {
  unzip: unzip
};
