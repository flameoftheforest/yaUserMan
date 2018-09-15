'use strict'
const assert = require('assert');
const Exists = require('./exists');
const ddbHelper = require('./ddbHelper');
const L = require('./log');

const GetAuthorization = async (event) => {
  L.LogStartOfFunc();
  Exists(event.headers.authorization);

  const extract = event.headers.authorization.split(" ");
  assert(extract[0]==="Bearer");
  const ret = ddbHelper.getTokenBody(extract[1]);
  const currEpoch = new Date();
  assert(ret.Expiry == -1 || ret.Expiry < currEpoch);
  return ret;
};

module.exports.Authorization = class {
  async constructor(event) {
    this.tokenBody = await GetAuthorization(event);
  }

  async AuthorizedAddUser() {
    const authList = {
      "Admin": undefined,
      "Developer": undefined
    }
    return (this.tokenBody.Role in authList);
  }
};