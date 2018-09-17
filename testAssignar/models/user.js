'use strict'
const Exists = require('../exists');
const L = require('../log');
const assert = require('assert');

const ValidatedAddUser = (json) => {
  let ret = Object.assign({}, json);

  Exists(
    ret.Email, 
    ret.FirstName, 
    ret.LastName, 
    ret.Password, 
    ret.ConfirmPassword, 
    ret.UserRole, 
    ret.ProfilePicture, 
    ret.Active
  );

  assert(ret.Password === ret.ConfirmPassword);
  assert(ret.UserRole in {"Admin":0, "Developer":0, "Editor":0});
  assert(Number.isInteger(ret.Active) && ret.Active >= 0 && ret.Active <= 1);
  return ret;
};

module.exports = ValidatedAddUser;
