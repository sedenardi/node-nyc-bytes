'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const crypto = require('crypto');
const glob = require('glob');
const downloader = require('./downloader');
const unzipper = require('./unzipper');

class FilePrep {
  constructor(dataset, dPath) {
    console.log(dPath);
    this.dataset = dataset;
    this.path = dPath;
    const parts = this.dataset.url.split('/');
    this.fileName = parts[parts.length-1];
    this.filePath = path.resolve(this.path, this.fileName);
  }
  mkPath() {
    return new Promise((resolve, reject) => {
      mkdirp(this.path, (err) => {
        if (err) { return reject(err); }
        return resolve();
      });
    });
  }
  checkExists() {
    return new Promise((resolve, reject) => {
      glob(this.filePath, (err, res) => {
        if (err) { return reject(err); }
        return resolve(res);
      });
    });
  }
  download() {
    console.log('downloading');
    return downloader.get(this.dataset.url, this.filePath).then(() => {
      console.log('done downloading');
      return this.checkHash();
    });
  }
  checkHash() {
    console.log('checking hash');
    const hashAction = new Promise((resolve, reject) => {
      const file = fs.createReadStream(this.filePath);
      const hash = crypto.createHash('sha1');
      file.on('end', () => {
        const d = hash.digest('hex').toString();
        if (d === this.dataset.hash) {
          return resolve(true);
        } else {
          console.log(`Failed hash. Expected ${this.dataset.hash}, Found ${d}. Redownloading.`);
          return resolve(false);
        }
      });
      file.on('data', (d) => { hash.update(d); });
      file.on('error', (err) => { reject(err); });
    });
    return hashAction.then((matches) => {
      if (matches) {
        return Promise.resolve();
      } else {
        return this.download();
      }
    });
  }
  checkFile() {
    return this.checkExists().then((res) => {
      if (!res.length) {
        return this.download();
      }
      return this.checkHash();
    });
  }
  extract() {
    console.log('extracting');
    return unzipper.unzip(this.filePath, this.path);
  }
  start() {
    return this.mkPath().then(() => {
      return this.checkFile();
    }).then(() => {
      return this.extract();
    });
  }
}

module.exports = FilePrep;
