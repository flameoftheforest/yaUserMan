'use strict'

const uuid = require('uuid/v1');

module.exports = async (userInfo) => {
  return {
    Token: uuid(),
    Email: userInfo.Email,
    Role: userInfo.UserRole,
    Expiry: Date.now() / 1000 + (process.env.TOKEN_PERIOD_IN_MINUTES * 60)
  }
}