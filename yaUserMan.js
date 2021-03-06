'use strict';
const L = require('./yaUserMan/log');
const {returnHttp} = require('./yaUserMan/returnHelper');
const ddbHelper = require('./yaUserMan/ddbHelper');
const AuthorizationChecker = require('./yaUserMan/authorizationChecker');
const BodyToObject = require('./yaUserMan/bodyToObject');
const assert = require('assert');
const tokenMaker = require('./yaUserMan/tokenMaker');
const setupTables = require('./yaUserMan/setupTables');
const ValidatedChangePassword = require('./yaUserMan/models/changepassword');
const File2S3Helper = require('./yaUserMan/file2S3Helper');


const Hello = async (event, context) => {
  L.LogStartOfFunc(Hello);
  return L.LogEndOfFunc(Hello, returnHttp(200, {message: `hello world`}));
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

  let profileUrl = "";

  BodyToObject(event);
  const authCheck = new AuthorizationChecker();
  return authCheck.Setup(event)
  .then(() => authCheck.EditUserAuthorized())
  .then((state) => {
    if (!state) throw returnHttp(401, {message:"Upload unauthorized."});
  })
  .then(() => File2S3Helper(event))
  .then((fileurl) => {
    profileUrl = fileurl;
  })
  .then(() => ddbHelper.getUser(event.body.email))
  .then((userDetail) => {
    userDetail.ProfilePicture = profileUrl;
    return userDetail;
  })
  .then((userDetail) => ddbHelper.addUser(userDetail))
  .then((state) => {
    if (!state) throw returnHttp(400, {message:"Upload failed."});
  })
  .then(() => {
    return L.LogEndOfFunc(Upload, returnHttp(200, {message: "Upload OK."}));
  })
  .catch((err) => {
    if (typeof err === "object" && err instanceof assert.AssertionError) {
      return L.LogEndOfFunc(Upload, returnHttp(500, err));
    }
    return L.LogEndOfFunc(Upload, err);
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

const SetupMasterLive = async (event, context) => {
  return new Promise((resolve, reject) => {
    resolve(true);
  })
  .then(() => ddbHelper.addTokenBody("xx123yy123zz123", "master@user.com", "Admin", 4102405200))
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
module.exports.setupmasterlive = SetupMasterLive;
module.exports.getuser = GetUser;
module.exports.login = Login;
module.exports.changepassword = ChangePassword;
module.exports.upload = Upload;