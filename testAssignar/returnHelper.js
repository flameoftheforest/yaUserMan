'use strict'
const Response = require('./models/response');

module.exports.returnOK = async (funcName, bodyObj) => {
  console.log(`END ${funcName}`);
  return (new Response({
    statusCode: 200,
    body: JSON.stringify(body)
  })).Model;
}

module.exports.returnHttp = async (funcName, statusCode, bodyObj) => {
  console.log(`END ${funcName}`);
  return (new Response({
    statusCode: statusCode,
    body: JSON.stringify(bodyObj),
  })).Model;
};

module.exports.returnFunk = async (funcName, retVal) => {
  console.log(`END ${funcName}`);
  if (retVal != null || retVal != undefined)
    return retVal;
};