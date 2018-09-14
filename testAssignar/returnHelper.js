'use strict'
const Response = require('./models/response');

module.exports.returnOK = async (bodyObj) => {
  return (Response(
    200,
    JSON.stringify(body)
  ));
}

module.exports.returnHttp = async (statusCode, bodyObj) => {
  return (Response(
    statusCode,
    JSON.stringify(bodyObj),
  ));
};