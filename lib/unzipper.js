const exec = require('child_process').exec;
const path = require('path');
const glob = require('glob');

const unzip = async function(zipPath, contentDir) {
  const cmd = `7za e '-x!__MACOSX/*' '-x!*/.DS_Store' -y '${zipPath}' -o'${contentDir}'`;
  await new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        return reject(new Error(stderr));
      }
      return resolve();
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
