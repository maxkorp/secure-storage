module.exports = {
  'parser': 'babel-eslint',
  'env': {
    "es6": true,
    "mocha": true,
    "node": true
  },
  'extends': 'airbnb',
  'plugins': [
    'react'
  ],
  'rules': {
    'func-names': 0,
    'arrow-body-style': 0,
    'brace-style': [2, 'stroustrup', {'allowSingleLine': true }],
    'comma-dangle': [2, "never"]
  }
};
