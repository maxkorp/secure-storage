'use strict'; // eslint-disable-line strict

const io = require('./io');
const operate = require('./operateOnData');
const debug = require('debug')('secure-storage:main');

const guard = (name, val) => {
  if (val) {
    return Promise.resolve();
  }
  return Promise.reject(`${name} is required`);
};

let corePromise = Promise.resolve();

module.exports = (encPath, password, algorithm) => {
  const ioImpl = io(encPath, password, algorithm);

  return {
    getPassword: (service, account) => {
      const newPromise = corePromise
        .then(() => guard('service', service))
        .then(() => guard('account', account))
        .then(() => ioImpl.load())
        .then((data) => {
          return operate.getPassword(data, service, account);
        })
        .catch(/* istanbul ignore next */(e) => {
          debug(e);
          return null;
        });

      corePromise = newPromise;
      return newPromise;
    },

    setPassword: (service, account, newPassword) => {
      let data;
      let success;
      const newPromise = corePromise
        .then(() => guard('service', service))
        .then(() => guard('account', account))
        .then(() => guard('newPassword', newPassword))
        .then(() => ioImpl.load())
        .then((_data) => { data = _data; })
        .then(() => operate.setPassword(data, service, account, newPassword))
        .then((_success) => { success = _success; })
        .then(() => success && ioImpl.save(data))
        .then(() => success)
        .catch(/* istanbul ignore next */() => false);

      corePromise = newPromise;
      return newPromise;
    },

    deletePassword: (service, account) => {
      let data;
      let success;
      const newPromise = corePromise
        .then(() => guard('service', service))
        .then(() => guard('account', account))
        .then(() => ioImpl.load())
        .then((_data) => { data = _data; })
        .then(() => operate.deletePassword(data, service, account))
        .then((_success) => { success = _success; })
        .then(() => success && ioImpl.save(data))
        .then(() => success)
        .catch(/* istanbul ignore next */() => false);

      corePromise = newPromise;
      return newPromise;
    },

    replacePassword: (service, account, newPassword) => {
      let data;
      let success;
      const newPromise = corePromise
        .then(() => guard('service', service))
        .then(() => guard('account', account))
        .then(() => guard('newPassword', newPassword))
        .then(() => ioImpl.load())
        .then((_data) => { data = _data; })
        .then(() => operate.replacePassword(data, service, account, newPassword))
        .then((_success) => { success = _success; })
        .then(() => success && ioImpl.save(data))
        .then(() => success)
        .catch(/* istanbul ignore next */() => false);

      corePromise = newPromise;
      return newPromise;
    },

    findPassword: (service) => {
      const newPromise = corePromise
        .then(() => guard('service', service))
        .then(() => ioImpl.load())
        .then((data) => operate.findPassword(data, service))
        .catch(/* istanbul ignore next */() => null);

      corePromise = newPromise;
      return newPromise;
    }
  };
};
