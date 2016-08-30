'use strict'; // eslint-disable-line strict

const crypto = require('crypto');
const fse = require('fs-extra-promise');
const path = require('path');
const debug = require('debug')('secure-storage:io');

module.exports = (encPath, _password, _algorithm) => {
  const password = _password || '';
  const algorithm = _algorithm || 'aes256';

  const actualPath = path.resolve(encPath);
  const doCrypto = (input, doingDecryption) => {
    debug('doing crypto: %s', doingDecryption ? 'decrypting' : 'encrypting');
    const inType = doingDecryption ? 'binary' : 'utf8';
    const cryptoHandler = doingDecryption ?
      crypto.createDecipher(algorithm, password) :
      crypto.createCipher(algorithm, password);

    const buffers = [
      new Buffer(cryptoHandler.update(input, inType)),
      new Buffer(cryptoHandler.final())
    ];

    const outputBuffer = Buffer.concat(buffers);
    debug('done doing crypto');
    return outputBuffer;
  };

  return {
    load: () => {
      debug('attempting to load');
      return Promise.resolve()
        .then(() => fse.readFileAsync(actualPath))
        .then((input) => doCrypto(input, true).toString())
        .then((output) => JSON.parse(output))
        .catch((e) => {
          debug('failed to load:');
          debug(e);
          return {};
        });
    },
    save: (inputJson) => {
      debug('attempting to save');
      return Promise.resolve()
        .then(() => fse.ensureFileAsync(actualPath))
        .then(() => JSON.stringify(inputJson, null, 2))
        .then((input) => doCrypto(input, false))
        .then((output) => fse.writeFileAsync(actualPath, output))
        .catch((e) => {
          debug('failed to save:');
          debug(e);
          throw e;
        });
    }
  };
};
