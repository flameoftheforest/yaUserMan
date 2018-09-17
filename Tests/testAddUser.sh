#!/bin/bash

url="https://1exvemgkdk.execute-api.ap-southeast-2.amazonaws.com/live"
# url="http://localhost:3000"

curl -X PUT "$url/user" \
-H "Authorization: Bearer $2" \
-H "x-api-key:  $1" \
-d '{"Email": "testuser1@test.com", "FirstName": "testFirst", "LastName": "testLast", "Password": "password", "ConfirmPassword": "password", "ProfilePicture": "http://link", "UserRole": "Editor", "Active": 1}'
--verbose