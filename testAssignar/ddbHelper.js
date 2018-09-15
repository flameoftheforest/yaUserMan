'use strict'
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
      Item: ValidateAddUser(userJson)
    };

    L.LogVar({request});
    dynamoDb.put(request, (err) => {
      if (err) {
        L.Log(`Error!`);
        L.LogVar({err});
        L.LogEndOfFunc(addUser, reject(false));
        return;
      }
      L.LogEndOfFunc(addUser, resolve(true));
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
  L.LogStartOfFunc(getUser);
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
        L.LogEndOfFunc(getUser, reject(err));
        return;
      }
      L.LogVar(data);
      L.LogEndOfFunc(getUser, resolve(data));
    });
  });
}; 

const getTokenBody = async (token) => {
  L.LogStartOfFunc(getTokenBody);
  Exists(token);
  L.LogVar(token);

  return new Promise((resolve, reject) => {
    const request = {
      TableName: process.env.TOKEN_DDB_TABLE,
      Key: token
    };
    L.LogVar(request);
    dynamoDb.get(request, (err, data) => {
      if (err) {
        L.Log(`Error!`);
        L.LogVar({err});
        L.LogEndOfFunc(getTokenBody, reject(err));
        return;
      }
      L.LogVar(data);
      L.LogEndOfFunc(getTokenBody, resolve(data));
    });
  });
}

module.exports.addUser = addUser;
module.exports.delUser = delUser;
module.exports.getUser = getUser;
module.exports.getTokenBody = getTokenBody