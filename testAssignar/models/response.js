'use strict'
const Exists = require('../exists');

module.exports = async (status, bodyStr, headers) => {
  headers = headers || {};
  headers = Object.assign(headers, {"Access-Control-Allow-Origin": "*"});
  return {
    statusCode: status, body: bodyStr, headers: headers
  };
};