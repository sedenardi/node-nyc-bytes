'use strict';

const mkdirp = require('mkdirp');

module.exports = function(path) {
  return new Promise((resolve, reject) => {
    mkdirp(path, (err) => {
      if (err) { return reject(err); }
      return resolve();
    });
  });
};
