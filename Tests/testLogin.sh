#!/bin/bash

url="https://1exvemgkdk.execute-api.ap-southeast-2.amazonaws.com/live"
# url="http://localhost:3000"

curl -X POST "$url/user/login" \
-H "x-api-key:  $1" \
-d '{"Email": "testuser1@test.com", "Password": "password"}'
--verbose