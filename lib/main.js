'use strict'; // eslint-disable-line strict

const io = require('./io');
const operate = require('./operateOnData');

module.exports = (encPath, password, algorithm) => {
  const ioImpl = io(encPath, password, algorithm);

  return {
    getPassword: (service, account) => {
      return ioImpl.load()
        .then((data) => operate.getPassword(data, service, account))
        .catch(() => null);
    },

    setPassword: (service, account, newPassword) => {
      let data;
      let success;
      return ioImpl.load()
        .then((_data) => { data = _data; })
        .then(() => operate.setPassword(data, service, account, newPassword))
        .then((_success) => { success = _success; })
        .then(() => success && ioImpl.save(data))
        .then(() => success)
        .catch(() => false);
    },

    deletePassword: (service, account) => {
      let data;
      let success;
      return ioImpl.load()
        .then((_data) => { data = _data; })
        .then(() => operate.deletePassword(data, service, account))
        .then((_success) => { success = _success; })
        .then(() => success && ioImpl.save(data))
        .then(() => success)
        .catch(() => false);
    },

    replacePassword: (service, account, newPassword) => {
      let data;
      let success;
      return ioImpl.load()
        .then((_data) => { data = _data; })
        .then(() => operate.replacePassword(data, service, account, newPassword))
        .then((_success) => { success = _success; })
        .then(() => success && ioImpl.save(data))
        .then(() => success)
        .catch(() => false);
    },

    findPassword: (service) => {
      return ioImpl.load()
        .then((data) => operate.getPassword(data, service))
        .catch(() => null);
    }
  };
};
