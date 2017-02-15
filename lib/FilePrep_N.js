'use strict';

const path = require('path');
const checkExists = require('./checkExists');
const makePath = require('./makePath');
const checkHash = require('./checkHash');
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
  download() {
    console.log('downloading');
    return downloader.get(this.dataset.url, this.filePath).then(() => {
      console.log('done downloading');
      return this.checkFile();
    });
  }
  checkFile() {
    return checkExists(this.filePath).then((exists) => {
      if (!exists) {
        return this.download();
      }
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
    console.log('extracting');
    return unzipper.unzip(this.filePath, this.path);
  }
  checkFiles() {
    const keys = Object.keys(this.dataset.files);
    const checks = keys.map((k) => {
      const filePath = path.resolve(this.path, k);
      const parts = filePath.split('/');
      const dir = parts.slice(0, parts.length - 1).join('/');
      return makePath(dir).then(() => {
        return checkExists(filePath);
      }).then((exists) => {
        if (!exists) { return Promise.resolve(false); }
        const chkHash = this.dataset.files[k];
        return checkHash(filePath, chkHash);
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
    return makePath(this.path).then(() => {
      return this.checkFiles();
    }).then((allSuccess) => {
      if (allSuccess) {
        return Promise.resolve();
      }
      return this.checkFile().then(() => {
        return this.checkFiles();
      }).then((success) => {
        if (success) {
          return Promise.resolve();
        } else {
          return Promise.reject('Error initializing dataset');
        }
      });
    });
  }
}

module.exports = FilePrep;
