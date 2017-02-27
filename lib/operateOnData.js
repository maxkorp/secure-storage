'use strict'; // eslint-disable-line strict

const debug = require('debug')('secure-storage:operateOnData');

module.exports.getPassword = (data, service, account) => {
  debug('getting password: %s %s %s', JSON.stringify(data), service, account);
  try {
    return data[service][account] || null;
  }
  catch (e) {
    return null;
  }
};

module.exports.setPassword = (data, service, account, newPassword) => {
  debug('setting password: %s %s %s %s', JSON.stringify(data), service, account, newPassword);
  let passSet = false;

  try {
    data[service] = data[service] || {}; // eslint-disable-line no-param-reassign
    if (!data[service][account]) {
      data[service][account] = newPassword; // eslint-disable-line no-param-reassign
      passSet = true;
    }
  }
  catch (e) { } // eslint-disable-line no-empty

  return passSet;
};

module.exports.deletePassword = (data, service, account) => {
  debug('deleting password: %s %s %s', JSON.stringify(data), service, account);
  let password = false;

  try {
    if (data[service][account]) {
      password = data[service][account];
      delete data[service][account]; // eslint-disable-line no-param-reassign
      if (!Object.keys(data[service])) {
        delete data[service]; // eslint-disable-line no-param-reassign
      }
    }
  }
  catch (e) {
    /* istanbul ignore next */
    password = false;
  }

  return password;
};

module.exports.replacePassword = (data, service, account, newPassword) => {
  debug('replacing password: %s %s %s %s', JSON.stringify(data), service, account, newPassword);
  module.exports.deletePassword(data, service, account);
  return module.exports.setPassword(data, service, account, newPassword);
};

module.exports.findPassword = (data, service) => {
  debug('finding password: %s %s', JSON.stringify(data), service);
  let password = null;

  if (data[service]) {
    const keys = Object.keys(data[service]);
    if (keys.length) {
      debug('found key for service %s for account %s', service, keys[0]);
      password = data[service][keys[0]];
    }
  }

  return password;
};
