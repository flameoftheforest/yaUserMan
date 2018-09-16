'use strict';
const L = require('./testAssignar/log');
const {returnHttp} = require('./testAssignar/returnHelper');
const ddbHelper = require('./testAssignar/ddbHelper');
const AuthorizationChecker = require('./testAssignar/authorizationChecker');
const BodyToObject = require('./testAssignar/bodyToObject');
const assert = require('assert');
const tokenMaker = require('./testAssignar/tokenMaker');
const setupTables = require('./testAssignar/setupTables');
const ValidatedChangePassword = require('./testAssignar/models/changepassword');
const File2S3Helper = require('./testAssignar/file2S3Helper');


const Hello = async (event, context) => {
  L.LogStartOfFunc(hello);
  return L.LogEndOfFunc(hello, returnHttp(200, {message: `hello world`}));
};

const Login = async (event, context) => {
  L.LogStartOfFunc(Login);
  L.LogVar({event});

  let userInfo;
  return BodyToObject(event)
  .then(() => ddbHelper.getUser(event.body.Email))
  .then((userFound) => {
    if (userFound.Password !== event.body.Password) {
      throw returnHttp(401, {message:"Login unauthorized. Password mismatch."});
    }
    return userFound;
  })
  .then((userFound) => {
    return tokenMaker(userFound);
  })
  .then((token) => ddbHelper.addTokenObj(token))
  .then((token) => {
    if (token === null)
      throw returnHttp(500, {message:"Add token failed."})
    return L.LogEndOfFunc(Login, returnHttp(200, {token: token}));
  })
  .catch((err) => {
    if (typeof err === "object" && err instanceof assert.AssertionError) {
      return L.LogEndOfFunc(Login, returnHttp(500, err));
    }
    return L.LogEndOfFunc(Login, err);
  })
  ;
};

const ChangePassword = async (event, context) => {
  L.LogStartOfFunc(ChangePassword);
  L.LogVar({event});

  const authCheck = new AuthorizationChecker();
  let userDetail;
  return BodyToObject(event)
  .then(() => {
    event.body = ValidatedChangePassword(event.body);
  })
  .then(() => authCheck.Setup(event))
  .then(async () => ddbHelper.getUser(await authCheck.Email()))
  .then((found) => userDetail = found)
  .then(() => {
    if (userDetail.Password !== event.body.Password) {
      throw returnHttp(401, 'Password does not match.')
    }
    userDetail.Password = event.body.NewPassword;
    userDetail.ConfirmPassword = event.body.NewConfirmPassword;
  })
  .then(() => ddbHelper.addUser(userDetail))
  .then((state) => {
    if (!state)  throw returnHttp(500, 'Add user failed.');
  })
  .then(async () => ddbHelper.delTokenBody(await authCheck.Token()))
  .then((state) => {
    if (!state) throw returnHttp(500, 'Delete token failed.')
  })
  .then(() => L.LogEndOfFunc(ChangePassword, returnHttp(200, {})))
  .catch((err) => {
    if (typeof err === "object" && err instanceof assert.AssertionError) {
      return L.LogEndOfFunc(ChangePassword, returnHttp(500, err));
    }
    return L.LogEndOfFunc(ChangePassword, err);
  })
  ;
};

const AddUser = async (event, context) => {
  L.LogStartOfFunc(AddUser);
  L.LogVar({event});

  const authCheck = new AuthorizationChecker();
  return BodyToObject(event)
  .then(() => authCheck.Setup(event))
  .then(() => authCheck.AddUserAuthorized())
  .then((state) => {
    if (!state) throw returnHttp(401, {message:"AddUser unauthorized."});
  })
  .then(() => ddbHelper.addUser(event.body))
  .then((state) => {
    if (!state) throw returnHttp(400, {message:"AddUser failed."});
  })
  .then(() => L.LogEndOfFunc(AddUser, returnHttp(200, {})))
  .catch((err) => {
    if (typeof err === "object" && err instanceof assert.AssertionError) {
      return L.LogEndOfFunc(AddUser, returnHttp(500, err));
    }
    return L.LogEndOfFunc(AddUser, err);
  });
};

const DeleteUser = async (event, context) => {
  L.LogStartOfFunc(DeleteUser);
  L.LogVar({event});

  BodyToObject(event);
  const authCheck = new AuthorizationChecker();
  return authCheck.Setup(event)
  .then(() => authCheck.DeleteUserAuthorized())
  .then((state) => {
    if (!state) throw returnHttp(401, {message:"DelUser unauthorized."});
  })
  .then(() => ddbHelper.delUser(event.body))
  .then((state) => {
    L.Log(`${state ? "true" : "false"}`);
    if (!state) throw returnHttp(400, {message:"DelUser failed."})
  })
  .then(() => L.LogEndOfFunc(DeleteUser, returnHttp(200, {})))
  .catch((err) => {
    if (typeof err === "object" && err instanceof assert.AssertionError) {
      return L.LogEndOfFunc(DeleteUser, returnHttp(500, err));
    }
    return L.LogEndOfFunc(DeleteUser, err);
  })
  ;
};

const GetUser = async (event, context) => {
  L.LogStartOfFunc(GetUser);
  L.LogVar({event});

  const authCheck = new AuthorizationChecker();
  return authCheck.Setup(event)
  .then(() => authCheck.GetUserAuthorized())
  .then((state) => {
    if (!state) throw returnHttp(401, {message:"GetUser unauthorized."});
  })
  .then(() => authCheck.Role())
  .then(async (currRole) => {
    const getByEmail = !(event.queryStringParameters === undefined || event.queryStringParameters === null || event.queryStringParameters.email === undefined);

    L.LogVar({currRole, getByEmail});
    if (currRole === "Editor" && !getByEmail) {
      L.Log(`getting all users for Editor`);
      return ddbHelper.getAllUsersNoPassword();
    }
    else
    if (currRole === "Editor" && getByEmail) {
      L.Log(`get user for Editor`);
      return ddbHelper.getUserNoPassword(await authCheck.Email());
    }
    else
    if (!getByEmail) {
      L.Log(`get all users for Admin/Developer`);
      return ddbHelper.getAllUsersNoPassword();
    }
    else
    if (getByEmail) {
      L.Log(`get user for Admin/Developer`);
      if (event.queryStringParameters.password === undefined)
        return ddbHelper.getUserNoPassword(event.queryStringParameters.email);
      else
        return ddbHelper.getUser(event.queryStringParameters.email);  
    }
    
    L.Log(`Unknow option.`);
    throw returnHttp(400, {message: "GetUser failed."})
  })
  .then((state) => {
    L.Log(`${state === null ? "failed" : "succeeded"}.`);
    if (state===null) throw returnHttp(400, {message:"GetUser failed."})
    return state;
  })
  .then((userDetail) => L.LogEndOfFunc(GetUser, returnHttp(200, userDetail)))
  .catch((err) => {
    if (typeof err === "object" && err instanceof assert.AssertionError) {
      return L.LogEndOfFunc(GetUser, returnHttp(500, err));
    }
    return L.LogEndOfFunc(GetUser, err);
  })
  ;
};

const Upload = async (event, context) => {
  L.LogStartOfFunc(Upload);
  L.LogVar({event});

  return File2S3Helper(event.body)
  .then((fileurl) => {
    return L.LogStartOfFunc(Upload, returnHttp(200, {message: fileurl}));
  })
  .catch((err) => {
    if (typeof err === "object" && err instanceof assert.AssertionError) {
      return L.LogEndOfFunc(GetUser, returnHttp(500, err));
    }
    return L.LogEndOfFunc(GetUser, err);
  })
  ;

};

const SetupMaster = async (event, context) => {
  return new Promise((resolve, reject) => {
    if( !(process.env.IS_OFFLINE) ) throw returnHttp(401, {message:"Setupmaster unauthorized."});
    resolve(true);
  })
  .then(() => setupTables())
  .then(() => ddbHelper.addTokenBody("xx123yy123zz123", "master@user.com", "Admin", -1))
  .then((state) => {
    if (!state) throw returnHttp(400, {message:"Setupmaster failed."});
    return L.LogEndOfFunc(AddUser, returnHttp(200, {message:"Setupmaster done."}));
  })
  .catch((err) =>  {
    if (typeof err === "object" && err instanceof assert.AssertionError) {
      return L.LogEndOfFunc(GetUser, returnHttp(500, err));
    }
    return L.LogEndOfFunc(GetUser, err);
  })
  ;
}

module.exports.hello = Hello;
module.exports.adduser = AddUser;
module.exports.deleteuser = DeleteUser;
module.exports.setupmaster = SetupMaster;
module.exports.getuser = GetUser;
module.exports.login = Login;
module.exports.changepassword = ChangePassword;
module.exports.upload = Upload;