'use strict'
const Exists = require('../exists');

module.exports.ValidatedAddUser = (json) => {
  Exists(json.Email, json.FirstName, json.LastName, json.Password, json.ConfirmPassword, json.UserRole, json.ProfilePicture, json.Active);

  assert(json.Password === json.ConfirmPassword);
  assert(json.User in {"Admin":undefined, "Developer":undefined, "Editor":undefined});
  assert(json.Active in {0:undefined, 1:undefined});
}