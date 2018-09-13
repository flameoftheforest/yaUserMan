'use strict'
const Exists = require('../exists');

module.exports.User = class {
  constructor(json) {
    this.model = {
      Email: Exists(json.Email),
      FirstName: Exists(json.FirstName),
      LastName: Exists(json.LastName),
      Password: Exists(json.Password),
      ConfirmPassword: Exists(json.ConfirmPassword),
      UserRole: Exists(json.UserRole),
      ProfilePicture: Exists(json.ProfilePicture),
      Active: Exists(json.Active),
    }

    assert(this.model.Password === this.model.ConfirmPassword);
    assert(this.model.User in {"Admin":undefined, "Developer":undefined, "Editor":undefined});
    assert(this.model.Active in {0:undefined, 1:undefined});
  }

  get DDBItem {
    return this.model;
  }
};