'use strict'
const Exists = require('../exists');

module.exports.Response = class {
  constructor(json) {
    this.model = {
      statusCode: Exists(json.statusCode),
      headers: json.headers || {},
      body: json.body || ""
    };
  }

  get Model() {
    return this.model;
  }
};