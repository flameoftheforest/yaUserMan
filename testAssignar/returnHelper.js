'use strict'

module.exports.returnOK = async (funcName, bodyObj) => {
  console.log(`END ${funcName}`);
  return {
    statusCode: 200,
    body: JSON.stringify(bodyObj),
  };
}

module.exports.return