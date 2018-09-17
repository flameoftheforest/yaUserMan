'use strict'

const Exists = require('./exists');
const L = require('./log');

const BodyToObject = async (event) => {
  return new Promise((resolve, reject) => {
    L.LogStartOfFunc(BodyToObject);
    Exists(event.body);
    event.body = JSON.parse(event.body);
    L.LogEndOfFunc(BodyToObject, resolve());
  })
}

module.exports = BodyToObject;