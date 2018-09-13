'use strict';

const functionName = require('./testAssignar/functionName');
const {returnHttp} = require('./testAssignar/returnHelper');

module.exports.hello = async (event, context) => {
  console.log(`START ${functionName()}`);
  console.log(typeof event);
  console.log(JSON.stringify(event));
  return returnHttp(functionName(), 200, {message: `hello world`});
};

module.exports.login = async (event, context) => {
  console.log(`START ${functionName()}`);

};