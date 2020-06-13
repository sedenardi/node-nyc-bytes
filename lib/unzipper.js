const yauzl = require('yauzl');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const unzip = function(filePath, rootDir) {
  return new Promise((resolve, reject) => {
    yauzl.open(filePath, { lazyEntries: true }, (err, zipfile) => {
      if (err) { return reject(err); }
      zipfile.on('error', (err) => { reject(err); });
      zipfile.on('close', () => { resolve(); });
      zipfile.on('entry', (entry) => {
        if (/\/$/.test(entry.fileName)) {
          const dest = path.resolve(rootDir, entry.fileName);
          fs.mkdir(dest, { recursive: true }, (err) => {
            if (err) { return reject(err); }
            zipfile.readEntry();
          });
        } else {
          zipfile.openReadStream(entry, (err, readStream) => {
            if (err) { return reject(err); }
            const dest = path.resolve(rootDir, entry.fileName);
            fs.mkdir(path.dirname(dest), { recursive: true }, (err) => {
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

const globFind = function(rootDir, ignore) {
  const pattern = path.join(rootDir, '/*.zip');
  return new Promise((resolve, reject) => {
    glob(pattern, { ignore: ignore }, (err, res) => {
      if (err) { return reject(err); }
      return resolve(res);
    });
  });
};

const recursiveUnzip = function(rootDir, ignore) {
  ignore = ignore || [];
  return globFind(rootDir, ignore).then((res) => {
    if (!res.length) { return Promise.resolve(); }

    const actions = res.map((f) => {
      return unzip(f, rootDir);
    });
    return Promise.all(actions).then(() => {
      ignore = ignore.concat(res);
      return recursiveUnzip(rootDir, ignore);
    });
  });
};

module.exports = {
  unzip: unzip,
  recursiveUnzip: recursiveUnzip
};
