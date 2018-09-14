'use strict'
const {returnFunk} = require('./testAssignar/returnHelper');
const ValidateUser = require('./models/user');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const L = require('./log');
const Exists = require('./exists');

const addUser = async (userJson) => {
  L.LogStartOfFunc(addUser);
  return new Promise((resolve, reject) => {
    const request = {
      TableName: process.env.USER_DDB_TABLE,
      Item: ValidateUser(userJson)
    };

    L.LogVar({request});
    dynamoDb.put(request, (err) => {
      if (err) {
        L.Log(`Error!`);
        L.LogVar({err});
        L.LogEndOfFunc(addUser, reject(err));
        return;
      }
      L.LogEndOfFunc(addUser, resolve());
    });
  });
};

const delUser = async (email) => {
  L.LogStartOfFunc(delUser);
  Exists(email);
  L.LogVar({email});

  return new Promise((resolve, reject) => {
    const request = {
      TableName: process.env.USER_DDB_TABLE,
      Key: email
    }
    L.LogVar(request);
    dynamoDb.delete(request, (err) => {
      if (err) {
        L.Log(`Error!`);
        L.LogVar({err});
        L.LogEndOfFunc(delUser, reject(err));
        return;
      }
      L.LogEndOfFunc(delUser, resolve());
    });
  });
}

const getUser = async (email) => {
  L.LogStartOfFunc(GetUser);
  Exists(email);
  L.LogVar(email);

  return new Promise((resolve, reject) => {
    const request = {
      TableName: process.env.USER_DDB_TABLE,
      Key: email
    };
    L.LogVar(request);
    dynamoDb.get(request, (err, data) => {
      if (err) {
        L.Log(`Error!`);
        L.LogVar({err});
        L.LogEndOfFunc(GetUser, reject(err));
        return;
      }
      L.LogVar(data);
      L.LogEndOfFunc(GetUser, resolve(data));
    });
  });
}; 

module.exports.addUser = addUser;
module.exports.delUser = delUser;
module.exports.getUser = getUser;