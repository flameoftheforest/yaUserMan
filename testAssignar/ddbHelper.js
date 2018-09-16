'use strict'
const ValidatedAddUser = require('./models/user');
const ValidatedAddToken = require('./models/token');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const L = require('./log');
const Exists = require('./exists');

// If is IS_OFFLINE is set, use local ddb
const dynamoDb = new AWS.DynamoDB.DocumentClient((() => {
  let options = {}
  if (process.env.IS_OFFLINE) {
    options = {
      region: 'localhost',
      endpoint: 'http://localhost:8777'
    }
  }
  return options;
})());

const addUser = async (userJson) => {
  L.LogStartOfFunc(addUser);
  return new Promise((resolve, reject) => {
    L.LogVar({userJson});
    const request = {
      TableName: process.env.USER_DDB_TABLE,
      Item: ValidatedAddUser(userJson)
    };

    L.LogVar({request});
    dynamoDb.put(request, (err) => {
      if (err) {
        L.Log(`Error!`);
        L.LogVar({err});
        L.LogEndOfFunc(addUser, resolve(false));
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
        L.LogEndOfFunc(delUser, resolve(false));
        return;
      }
      L.LogEndOfFunc(delUser, resolve(true));
    });
  });
}

const getAllUsersNoPassword = async () => {
  L.LogStartOfFunc(getAllUsersNoPassword);

  return new Promise((resolve, reject) => {
    var request = {
      TableName: process.env.USER_DDB_TABLE,
    };
    L.LogVar(request);
    dynamoDb.scan(request, (err, found) => {
      if (err) {
        L.Log(`Error!`);
        L.LogVar({err});
        L.LogEndOfFunc(getAllUsersNoPassword, resolve(null));
        return;
      }
      L.LogVar({found});
      const more = found.LastEvaluatedKey;
      L.LogVar({more});
      if (found.Items === undefined) {
        L.Log('returned empty value.');
        L.LogEndOfFunc(getAllUsersNoPassword, resolve(null));
      }
      else {
        found = found.Items;
        for(let f of found) {
          delete f.Password;
          delete f.ConfirmPassword;
        }
        L.LogEndOfFunc(getAllUsersNoPassword, resolve(found));
      }
    })
  })
  ;
}; 

const getUser = async (email) => {
  L.LogStartOfFunc(getUser);
  Exists(email);
  L.LogVar(email);

  return new Promise((resolve, reject) => {
    const request = {
      TableName: process.env.USER_DDB_TABLE,
      Key: { "Email": email }
    };
    L.LogVar(request);
    dynamoDb.get(request, (err, foundUser) => {
      if (err) {
        L.Log(`Error!`);
        L.LogVar({err});
        L.LogEndOfFunc(getUser, resolve(null));
        return;
      }
      L.LogVar({foundUser});
      if (foundUser.Item === undefined) {
        L.Log('returned empty value.');
        L.LogEndOfFunc(getUser, resolve(null));
      }
      else {
        foundUser = foundUser.Item;
        L.LogEndOfFunc(getUser, resolve(foundUser));
      }
    });
  });
};

const getUserNoPassword = async (email) => {
  L.LogStartOfFunc(getUserNoPassword);
  Exists(email);
  L.LogVar(email);
  return getUser(email)
  .then((userDetail) => {
    delete userDetail.Password;
    delete userDetail.ConfirmPassword;
    return userDetail;
  })
  ;
};

const getTokenBody = async (token) => {
  L.LogStartOfFunc(getTokenBody);
  Exists(token);
  L.LogVar({token});

  return new Promise((resolve, reject) => {
    const request = {
      Key: { "Token": token }, 
       TableName: process.env.TOKEN_DDB_TABLE
    };
    L.LogVar({request});
    dynamoDb.get(request, (err, data) => {
      if (err) {
        L.Log(`Error!`);
        L.LogVar({err});
        L.LogEndOfFunc(getTokenBody, reject(err));
        return;
      }
      L.Log('dynamoDb finished calling.');
      L.LogVar({data});
      L.LogEndOfFunc(getTokenBody, resolve(data));
    });
  });
}

const addTokenObj = async (token) => {
  L.LogStartOfFunc(addTokenObj);
  Exists(token);
  L.LogVar({token});

  return new Promise((resolve, reject) => {
    const request = {
      TableName: process.env.TOKEN_DDB_TABLE,
      Item: ValidatedAddToken(token)
    };

    L.LogVar({request});
    dynamoDb.put(request, (err) => {
      if (err) {
        L.Log(`Error!`);
        L.LogVar({err});
        L.LogEndOfFunc(addTokenObj, reject(null));
        return;
      }
      L.LogEndOfFunc(addTokenObj, resolve(token.Token));
    });
  });
}

const addTokenBody = async (token, email, role, expiry) => {
  L.LogStartOfFunc(addTokenBody);
  Exists(email, role, token, expiry);
  L.LogVar({email, role, token, expiry});

  return new Promise((resolve, reject) => {
    const request = {
      TableName: process.env.TOKEN_DDB_TABLE,
      Item: {
        Token: token,
        Email: email,
        Role: role,
        Expiry: expiry
      }
    };
    L.LogVar({request});
    dynamoDb.put(request, (err) => {
      if (err) {
        L.Log(`Error!`);
        L.LogVar({err});
        L.LogEndOfFunc(addTokenBody, reject(false));
        return;
      }
      L.LogEndOfFunc(addTokenBody, resolve(true));
    });
  });
}

const delTokenBody = async (token) => {
  L.LogStartOfFunc(delTokenBody);
  Exists(token);
  L.LogVar({token});

  return new Promise((resolve, reject) => {
    const request = {
      TableName: process.env.TOKEN_DDB_TABLE,
      Key: { Token: token }
    };

    L.LogVar(request);
    dynamoDb.delete(request, (err) => {
      if (err) {
        L.Log(`Error!`);
        L.LogVar({err});
        L.LogEndOfFunc(delTokenBody, resolve(false));
        return;
      }
      L.LogEndOfFunc(delTokenBody, resolve(true));
    });
  })
  ;
}

module.exports.addUser = addUser;
module.exports.delUser = delUser;
module.exports.getAllUsersNoPassword = getAllUsersNoPassword;
module.exports.getUser = getUser;
module.exports.getUserNoPassword = getUserNoPassword;
module.exports.getTokenBody = getTokenBody;
module.exports.addTokenBody = addTokenBody;
module.exports.addTokenObj = addTokenObj;
module.exports.delTokenBody = delTokenBody;