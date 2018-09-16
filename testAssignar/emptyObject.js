'use strict'

module.exports = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};