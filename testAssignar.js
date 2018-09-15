'use strict';
const L = require('./testAssignar/log');
const {returnHttp} = require('./testAssignar/returnHelper');
const ddbHelper = require('./testAssignar/ddbHelper');
const AuthorizationChecker = require('./testAssignar/authorizationChecker');

const Hello = async (event, context) => {
  L.LogStartOfFunc(hello);
  return L.LogEndOfFunc(hello, returnHttp(200, {message: `hello world`}));
};

const AddUser = async (event, context) => {
  L.LogStartOfFunc(AddUser);
  L.LogVar({event});

  const authCheck = new AuthorizationChecker(event);
  if (!authCheck.AuthorizedAddUser()) {
    return L.LogEndOfFunc(AddUser, returnHttp(401, {message:"AddUser unauthorized."}));
  }

  if (await ddbHelper.addUser(event.body)) {
    return L.LogEndOfFunc(AddUser, returnHttp(400, {message:"AddUser failed."}));
  }
  
  return L.LogEndOfFunc(AddUser, returnHttp(200, {}));
};

module.exports.hello = Hello;
module.exports.adduser = AddUser;