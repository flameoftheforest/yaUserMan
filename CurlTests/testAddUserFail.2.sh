#!/bin/bash

curl -X POST 'https://1exvemgkdk.execute-api.ap-southeast-2.amazonaws.com/live/adduser' \
-H 'Authorization: Bearer 7894lsdkfjaioret653' \
-d '{"FirstName": "testFirst", "LastName": "testLast", "Password": "password", "ConfirmPassword": "password", "ProfilePicture": "http://link", "Active": 1}'