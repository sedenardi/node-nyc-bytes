const fs = require('fs');
const crypto = require('crypto');

module.exports = function(filePath, chkHash) {
  return new Promise((resolve, reject) => {
    const file = fs.createReadStream(filePath);
    const hash = crypto.createHash('sha1');
    file.on('end', () => {
      const d = hash.digest('hex').toString();
      if (d === chkHash) {
        return resolve(true);
      } else {
        return reject(new Error(`${filePath} Failed hash - Expected ${chkHash}, Found ${d}`));
      }
    });
    file.on('data', (d) => { hash.update(d); });
    file.on('error', (err) => { reject(err); });
  });
};
