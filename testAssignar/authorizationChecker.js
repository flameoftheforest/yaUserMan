'use strict'
const assert = require('assert');
const Exists = require('./exists');
const Empty = require('./emptyObject');
const ddbHelper = require('./ddbHelper');
const L = require('./log');
const {returnHttp} = require('./returnHelper');

const GetAuthorization = async (event) => {
  L.LogStartOfFunc(GetAuthorization);
  if (event.headers.authorization === undefined) {
    Exists(event.headers.Authorization);
    event.headers.authorization = event.headers.Authorization;
  }

  const extract = event.headers.authorization.split(" ");
  assert(extract[0]==="Bearer");
  let ret = await ddbHelper.getTokenBody(extract[1]);
  if (Empty(ret)) {
    throw returnHttp(401, {message: "Token not found."});
  }
  ret = ret.Item;
  L.LogVar({ret});
  const currEpoch = Date.now() / 1000;
  if (ret.Expiry != -1 && ret.Expiry < currEpoch) {
    throw returnHttp(401, {message: "Token expired."});
  }
  return L.LogEndOfFunc(GetAuthorization, ret);
};

module.exports = class {
  constructor(event) {
  }

  async Setup(event) {
    this.tokenBody = await GetAuthorization(event);
  }

  async Role() {
    return this.tokenBody.Role;
  } 

  async Email() {
    return this.tokenBody.Email;
  }

  async Token() {
    return this.tokenBody.Token;
  }

  async AddUserAuthorized() {
    L.LogStartOfFunc(this.AddUserAuthorized);
    Exists(this.tokenBody);
    const authList = {
      "Admin": 0,
      "Developer": 0
    }
    const ret = (this.tokenBody.Role in authList);
    L.Log({ret});
    return L.LogEndOfFunc(this.AddUserAuthorized, (this.tokenBody.Role in authList));
  }

  async DeleteUserAuthorized() {
    L.LogStartOfFunc(this.DeleteUserAuthorized);
    Exists(this.tokenBody);
    const authList = {
      "Admin": 0
    }
    const ret = (this.tokenBody.Role in authList);
    L.Log({ret});
    return L.LogEndOfFunc(this.DeleteUserAuthorized, (this.tokenBody.Role in authList));
  }

  async GetUserAuthorized() {
    L.LogStartOfFunc(this.GetUserAuthorized);
    Exists(this.tokenBody);
    const authList = {
      "Admin": 0,
      "Developer": 0,
      "Editor": 0
    }
    const ret = (this.tokenBody.Role in authList);
    L.Log({ret});
    return L.LogEndOfFunc(this.GetUserAuthorized, (this.tokenBody.Role in authList));
  }
};