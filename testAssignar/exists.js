'use strict'
const assert = require('assert');
module.exports.Exists = (...args) => {
  for(let arg in args) {
    assert(arg != undefined && arg != null);
  }
  return args;
}
