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
    this.files = this.dataset.urls.map((url) => {
      const parts = url.url.split('/');
      url.fileName = parts[parts.length - 1];
      url.filePath = path.resolve(this.path, url.fileName);
      return url;
    });
  }
  static async downloadFile(url) {
    await downloader.get(url.url, url.filePath);
    try {
      await checkHash(url.filePath, url.hash);
    } catch(err) {
      console.log(err);
      await FilePrep.downloadFile(url);
    }
  }
  async download() {
    console.log(`Downloading: ${this.dataset.name}`);
    await fs.remove(this.path);
    await makePath(this.path);
    const downloads = this.files.map(FilePrep.downloadFile);
    await Promise.all(downloads);
    await unzipper.recursiveUnzip(this.path);
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
