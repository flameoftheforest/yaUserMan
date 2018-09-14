'use strict'
const Exists = require('../exists');

module.exports = async (status, bodyStr, headers) => {
  return {
    statusCode: status, body: bodyStr, headers: headers
  };
};