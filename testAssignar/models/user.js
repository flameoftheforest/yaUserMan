'use strict'
const Exists = require('../exists');

module.exports.User = class {
  constructor(json) {
    this.Email = Exists(json.Email);
    this.FirstName = Exists(json.FirstName);
    this.LastName = Exists(json.LastName);
    this.Password = Exists(json.Password);
    this.ConfirmPassword = Exists(json.ConfirmPassword);
    this.UserRole = Exists(json.UserRole);
    this.ProfilePicture = Exists(json.ProfilePicture);
    this.Active = Exists(json.Active);

    assert(this.Password === this.model.ConfirmPassword);
    assert(this.User in {"Admin":undefined, "Developer":undefined, "Editor":undefined});
    assert(this.Active in {0:undefined, 1:undefined});
  }
};