const glob = require('glob');

module.exports = function(filePath) {
  return new Promise((resolve, reject) => {
    glob(filePath, (err, res) => {
      if (err) { return reject(err); }
      return resolve(res.length);
    });
  });
};
