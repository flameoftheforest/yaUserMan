#!/bin/bash

# url="https://1exvemgkdk.execute-api.ap-southeast-2.amazonaws.com/live"
url="http://localhost:3000"

curl -X PUT "$url/user" \
-H 'Authorization: Bearer xx123yy123zz123' \
-H 'x-api-key:  d41d8cd98f00b204e9800998ecf8427e' \
-d '{"Email": "testuser1@test.com", "FirstName": "testFirst", "LastName": "testLast", "Password": "password", "ConfirmPassword": "password", "ProfilePicture": "http://link", "UserRole": "Editor", "Active": 1}'