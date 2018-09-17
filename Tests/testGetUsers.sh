#!/bin/bash

url="https://1exvemgkdk.execute-api.ap-southeast-2.amazonaws.com/live"
# url="http://localhost:3000"

curl "$url/user" \
-H "x-api-key:  $1" \
-H "Authorization: Bearer $2" \
--verbose