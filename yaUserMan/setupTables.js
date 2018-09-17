'use strict'

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const L = require('./log');
const Exists = require('./exists');

const Init = async () => {
  return L.LogEndOfFunc(Init, new AWS.DynamoDB((() => {
    L.LogStartOfFunc(Init);
    let options = {}
    if (process.env.IS_OFFLINE) {
      options = {
        region: 'localhost',
        endpoint: 'http://localhost:8777'
      }
    }
    return options;
  })()));
};

const CreateUserTable = async (dynamoDbX) => {
  L.Log("????");
  return new Promise((resolve, reject) => {
    L.LogStartOfFunc(CreateUserTable);
    var params = {
      AttributeDefinitions: [
         {
        AttributeName: "Email", 
        AttributeType: "S"
       }
      ], 
      KeySchema: [
         {
        AttributeName: "Email", 
        KeyType: "HASH"
       } 
      ], 
      ProvisionedThroughput: {
       ReadCapacityUnits: 1, 
       WriteCapacityUnits: 1
      }, 
      TableName: process.env.USER_DDB_TABLE
     };
     dynamoDbX.createTable(params, function(err, data) {
       if (err) {
        L.Log(err, err.stack); // an error occurred
        throw 'Create User Table failed.';
       }
       else {
         L.Log(data);           // successful response
         L.LogEndOfFunc(CreateUserTable, resolve(true));
       }
     });
  });
};

const CreateTokenTable = async (dynamoDbX) => {
  return new Promise((resolve, reject) => {
    L.LogStartOfFunc(CreateTokenTable);
    var params = {
      AttributeDefinitions: [
         {
        AttributeName: "Token", 
        AttributeType: "S"
       }
      ], 
      KeySchema: [
         {
        AttributeName: "Token", 
        KeyType: "HASH"
       } 
      ], 
      ProvisionedThroughput: {
       ReadCapacityUnits: 1, 
       WriteCapacityUnits: 1
      }, 
      TableName: process.env.TOKEN_DDB_TABLE
     };
     dynamoDbX.createTable(params, function(err, data) {
       if (err) {
        L.Log(err, err.stack); // an error occurred
        throw 'Create Token Table failed.';
       }
       else {
         L.Log(data);           // successful response
         L.LogEndOfFunc(CreateTokenTable, resolve(true));
       }
     });
  });
}

module.exports = async () => {
  let dynamoDB = "";
  return Init()
  .then((ddbx) => {
    dynamoDB = ddbx;
  })
  .then(() => CreateUserTable(dynamoDB))
  .then(() => CreateTokenTable(dynamoDB))
  ;
}