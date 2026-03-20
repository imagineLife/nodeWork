const dataLib = require('../../../lib/data');

const tokensRepo = {
  create(id, tokenObj, callback) {
    dataLib.create('tokens', id, tokenObj, callback);
  },

  read(id, callback) {
    dataLib.read('tokens', id, callback);
  },

  update(id, tokenObj, callback) {
    dataLib.update('tokens', id, tokenObj, callback);
  },

  remove(id, callback) {
    dataLib.delete('tokens', id, callback);
  }
};

module.exports = tokensRepo;
