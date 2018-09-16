'use strict'
const assert = require('assert');
const Exists = (...args) => {
  for(let i=0; i<args.length; ++i) {
    assert(args[i] != undefined);
    assert(args[i] != null);
  }
  return args;
};

module.exports = Exists;
