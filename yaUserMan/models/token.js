'use strict'
const Exists = require('../exists');
const L = require('../log');
const assert = require('assert');

const ValidatedAddToken = (json) => {
  Exists(
    json.Email, 
    json.Role, 
    json.Expiry, 
    json.Token
  );

  assert(json.Role in {"Admin":0, "Developer":0, "Editor":0});
  assert(json.Expiry > Date.now() / 1000);
  return json;
};

module.exports = ValidatedAddToken;