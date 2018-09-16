'use strict'
const Exists = require('../exists');

module.exports = async (status, bodyStr, headers) => {
  headers = headers || {};
  headers = Object.assign(headers, {
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  });
  return {
    statusCode: status, body: bodyStr, headers: headers
  };
};