'use strict'
const functionName = require('./functionName');
const {returnFunk} = require('./testAssignar/returnHelper');
const User = require('./models/user');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.addUser = async (userJson) => {
  return new Promise((resolve, reject) => {
    console.log(`START ${functionName()}`);
    const request = {
      TableName: process.env.USER_DDB_TABLE,
      Item: new User(userJson)
    };
    console.log(JSON.stringify(request));
    dynamoDb.put((request, (err) => {
      if (err) {
        console.error(err);
        returnFunk(functionName(), reject({WHAT TO PUT HERE??}));
      }
      returnFunk(functionName(), resolve());
    }));
  });
  
};