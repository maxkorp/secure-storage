'use strict'; // eslint-disable-line strict

const io = require('./io');
const operate = require('./operateOnData');

const guard = (name, val) => {
  if (val) {
    return Promise.resolve();
  }
  return Promise.reject(name + ' is required');
};

module.exports = (encPath, password, algorithm) => {
  const ioImpl = io(encPath, password, algorithm);

  return {
    getPassword: (service, account) => {
      return Promise.resolve()
        .then(() => guard('service', service))
        .then(() => guard('account', account))
        .then(() => ioImpl.load())
        .then((data) => operate.getPassword(data, service, account))
        .catch(() => null);
    },

    setPassword: (service, account, newPassword) => {
      let data;
      let success;
      return Promise.resolve()
        .then(() => guard('service', service))
        .then(() => guard('account', account))
        .then(() => guard('newPassword', newPassword))
        .then(() => ioImpl.load())
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
      return Promise.resolve()
        .then(() => guard('service', service))
        .then(() => guard('account', account))
        .then(() => ioImpl.load())
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
      return Promise.resolve()
        .then(() => guard('service', service))
        .then(() => guard('account', account))
        .then(() => guard('newPassword', newPassword))
        .then(() => ioImpl.load())
        .then((_data) => { data = _data; })
        .then(() => operate.replacePassword(data, service, account, newPassword))
        .then((_success) => { success = _success; })
        .then(() => success && ioImpl.save(data))
        .then(() => success)
        .catch(() => false);
    },

    findPassword: (service) => {
      return Promise.resolve()
        .then(() => guard('service', service))
        .then(() => guard('account', account))
        .then(() => ioImpl.load())
        .then((data) => operate.getPassword(data, service))
        .catch(() => null);
    }
  };
};
