# yaUserMan
## Features
+ AWS Service Used:
  + Lambda
  + DynamoDB
  + API Gateway + API Key
  + S3
+ Language/Platform:
  + NodeJS
+ Frontend Framework:
  + React (in Tests/Frontend only)
+ Deployment Framework:
  + Serverless

## Available Endpoints
+ PUT - https://????.amazonaws.com/live/user
  + Create a user
  + Only Admin role is able to perform task.
  + Headers:
    + x-api-key: \<string>
    + Authorization: Bearer \<string>
  + Request body: 
  ```
  {
    Email: <string>, 
    FirstName: <string>, 
    LastName: <string>, 
    Password: <string>, 
    ConfirmPassword: <string>, 
    UserRole: [Admin | Developer | Editor], 
    ProfilePicture: <string>, 
    Active: [0 | 1]
  }
  ```
  + Response:
    + 200
    + 400 - Request Error.
    + 401 - Unauthorized.
    + 500 - Error.

+ DELETE - https://????.amazonaws.com/live/user
  + Delete a user.
  + Only Admin role is able to perform task.
  + Headers:
    + x-api-key: \<string>
    + Authorization: Bearer \<string>
  + Request body:
  ```
  {
    Email: <string>
  }
  ```
  + Reponse:
    + 200
    + 400 - Request Error.
    + 401 - Unauthorized.
    + 500 - Error.

+ GET - https://????.amazonaws.com/live/user
  + Get user/users detail.
  + Headers:
    + x-api-key: \<string>
    + Authorization: Bearer \<string>
  + Query Parameters supported:
    + email=\<string>
  + Response:
    + 200 with response.
    + 400 - Request error.
    + 401 - Unauthorized.
    + 500 - Error.

+ POST - https://????.amazonaws.com/live/user/login
  + Logins in user, obtains a 1 hour token.
  + Headers:
    + x-api-key: \<string>
  + Request body:
  ```
  {
    Email: <string>,
    Password: <string>
  }
  ```
  + Response:
  + 200 with reponse.
  + 400 - Request Error.
  + 401 - Unauthorized.
  + 500 - Error.

+ POST - https://????.amazonaws.com/live/user/changepassword
  + Change password. Only changes password of token holder.
  + Headers:
    + x-api-key: \<string>
    + Authorization: Bearer \<string>
  + Request body:
  ```
  {
    Password: <string>,
    NewPassword: <string>,
    NewConfirmPassword: <string>
  }
  ```
  + Response:
    + 200
    + 400 - Request Error.
    + 401 - Unauthorized.
    + 500 - Error.

+ POST - https://????.amazonaws.com/live/upload
  + Upload image. Associates it with the profile picture of email.
  + Only Admin can perform this task.
  + Headers:
    + x-api-key: \<string>
    + Authorization: Bearer \<string>
  + Request body:
  ```
  {
    email: <string>
    base64: <base64 string> // file data
    header: <string> // file meta-data
    name: <string> // file name
  }
  ```
  + Response:
    + 200
    + 400 - Request error.
    + 401 - Unauthorized.
    + 500 - Error.
  + Note: refer to `Tests/Frontend/App.js` to see how to construct the Request body.

##Tests 
#### Overview
+ All tests resides in the /Tests folder. 

+ All tests uses Curls. 

+ All tests needs proper aws-urls.

+ All tests needs to be modified with proper body.

#### Decription
+ 01Test.sh
  + Convenient wrapper for login
  + Edit url and apiKey in file for proper execution

+ 02Test.sh
  + Convenient wrapper for running add/get/delete user
  + Edit url, apiKey and token in file for proper execution

+ testLogin.sh \<aws-url> \<api-key>
  + Tests user login

+ testAddUser.sh \<aws-url> \<api-key> \<token>
  + Tests the add user endpoint

+ testDelUser.sh \<aws-url> \<api-key> \<token>
  + Tests the delete user endpoint

+ testGetUser.sh \<aws-url> \<api-key> \<token>
  + Tests the get user endpoint

+ frontend upload test
  + Tests uploading of profile picture and CORS
  + Steps:
    + Navigate to frontend/
    + `npm install`
    + `npm start`
    + Navigate in browser to `http://localhost:6546` if it did not start.
    + Insert aws-url
    + Insert api-key
    + Insert token (using `testLogin.sh` to generate one).
    + Insert email address of target user.
    + Select a file.
    + Click `Upload!`
    + Use `testGetUser.sh` to observe updated profilepicture link.
    + User browser to check if link works.

  #### Adding for testing
  