#!/bin/bash

url="https://1exvemgkdk.execute-api.ap-southeast-2.amazonaws.com/live"
# url="http://localhost:3000"

curl -X POST "$url/user/changepassword" \
-H "Authorization: Bearer $2" \
-H "x-api-key:  $1" \
-d '{"Password": "password", "NewPassword": "password", "NewConfirmPassword": "password"}'
--verbose