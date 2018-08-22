const path = require('path');
const fs = require('fs-extra');
const checkExists = require('./checkExists');
const makePath = require('./makePath');
const checkHash = require('./checkHash');
const downloader = require('./downloader');
const unzipper = require('./unzipper');

class FilePrep {
  constructor(dataset, dPath) {
    this.dataset = dataset;
    this.path = dPath;
    const parts = this.dataset.url.split('/');
    this.fileName = parts[parts.length-1];
    this.filePath = path.resolve(this.path, this.fileName);
  }
  download() {
    console.log(`Downloading: ${this.dataset.name}`);
    return fs.remove(this.path).then(() => {
      return makePath(this.path);
    }).then(() => {
      return downloader.get(this.dataset.url, this.filePath);
    }).then(() => {
      return checkHash(this.filePath, this.dataset.hash).then((res) => {
        if (res) {
          return this.extract();
        } else {
          return this.download();
        }
      });
    });
  }
  extract() {
    return unzipper.recursiveUnzip(this.path);
  }
  checkFiles() {
    const checks = this.dataset.files.map((k) => {
      const filePath = path.resolve(this.path, k);
      const parts = filePath.split('/');
      const dir = parts.slice(0, parts.length - 1).join('/');
      return makePath(dir).then(() => {
        return checkExists(filePath);
      });
    });
    return Promise.all(checks).then((res) => {
      const allSuccess = res.reduce((res, v) => {
        return res && v;
      }, true);
      return Promise.resolve(allSuccess);
    });
  }
  start() {
    console.log(`Initializing: ${this.dataset.name}`);
    return makePath(this.path).then(() => {
      return this.checkFiles();
    }).then((allSuccess) => {
      if (allSuccess) {
        console.log(`Done initializing: ${this.dataset.name}`);
        return Promise.resolve();
      }
      return this.download().then(() => {
        return this.checkFiles();
      }).then((success) => {
        if (success) {
          console.log(`Done initializing: ${this.dataset.name}`);
          return Promise.resolve();
        } else {
          return Promise.reject('Error initializing dataset');
        }
      });
    });
  }
}

module.exports = FilePrep;
