const fs = require('fs-extra');

module.exports = function(path) {
  return new Promise((resolve, reject) => {
    fs.remove(path, function (err) {
      if (err) return reject(err);
      return resolve();
    });
  });
};
