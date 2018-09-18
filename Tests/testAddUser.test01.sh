#!/bin/bash

curl -X PUT "$1/user" \
-H "Authorization: Bearer $3" \
-H "x-api-key:  $2" \
-d '{"Email": "test01@test.com", "FirstName": "testFirst", "LastName": "testLast", "Password": "abcdefg", "ConfirmPassword": "abcdefg", "ProfilePicture": "http://link", "UserRole": "Editor", "Active": 1}' \
--verbose