'use strict'

const Exists = require('../exists');
const L = require('../log');
const assert = require('assert');

const ValidatedChangePassword = (json) => {
  Exists(
    json.Password,
    json.NewPassword,
    json.NewConfirmPassword
  );

  assert(json.NewPassword === json.NewConfirmPassword);
  return json;
};

module.exports = ValidatedChangePassword; 