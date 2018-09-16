'use strict'
const Exists = require('../exists');
const L = require('../log');
const assert = require('assert');

const ValidatedAddUser = (json) => {
  Exists(
    json.Email, 
    json.FirstName, 
    json.LastName, 
    json.Password, 
    json.ConfirmPassword, 
    json.UserRole, 
    json.ProfilePicture, 
    json.Active
  );

  assert(json.Password === json.ConfirmPassword);
  assert(json.UserRole in {"Admin":0, "Developer":0, "Editor":0});
  assert(Number.isInteger(json.Active) && json.Active >= 0 && json.Active <= 1);
  return json;
};

module.exports = ValidatedAddUser;
