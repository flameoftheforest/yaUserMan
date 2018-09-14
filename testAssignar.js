'use strict';
const L = require('./testAssignar/log');
const {returnHttp} = require('./testAssignar/returnHelper');

const hello = async (event, context) => {
  L.LogStartOfFunc(hello);
  return L.LogEndOfFunc(hello, returnHttp(200, {message: `hello world`}));
};

const login = async (event, context) => {
  L.LogStartOfFunc(login);
  
};

module.exports.hello = hello;
module.exports.login = login;