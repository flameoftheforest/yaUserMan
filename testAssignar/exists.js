'use strict'
const assert = require('assert');
module.exports.Exists = (k) => {
  assert(k != undefined && k != null);
  return k;
}
