# yaUserMan
## AWS Services Used:
+ Lambda
+ DynamoDB
+ API Gateway + API Key
+ 

## Available Endpoints
+ PUT - https://????.amazonaws.com/live/user
  + Create a user
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
  + Only Admin role is enabled to do so

+ GET - https://????.amazonaws.com/live/user
+ POST - https://????.amazonaws.com/live/user/login
+ POST - https://????.amazonaws.com/live/user/changepassword
+ POST - https://????.amazonaws.com/live/upload

##Tests