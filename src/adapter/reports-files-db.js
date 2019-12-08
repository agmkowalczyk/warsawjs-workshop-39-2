const knex = require('knex')(require('../../knexfile'));

const fs = {};

fs.readdir = function (filename, callback = () => {}) {
  knex('reports')
    .select('filename')
    .then(function(rows) {
      const files = rows.map(function(row) {
        return row.filename;
      });
      callback(null, files);
    })
    .catch(error => {
      callback(error);
    });
};

function extractFileName(path) {
  return path.replace(/^.*[\\/]/, '');
}

fs.rename = function (oldPath, newPath, callback) {
  const oldFileName = extractFileName(oldPath);
  const newFileName = extractFileName(newPath);

  knex('reports')
    .where('filename', oldFileName)
    .update({ filename: newFileName })
    .then(() => callback(null, 'OK'))
    .catch((err => callback(err)));
};

module.exports = fs;
