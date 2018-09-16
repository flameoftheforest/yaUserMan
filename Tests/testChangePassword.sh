#!/bin/bash

# url="https://1exvemgkdk.execute-api.ap-southeast-2.amazonaws.com/live"
url="http://localhost:3000"

# curl -X POST "$url/user/changepassword" \
# -H 'x-api-key:  d41d8cd98f00b204e9800998ecf8427e' \
# -H 'Authorization: Bearer 7084cc20-b97a-11e8-bcdb-a99b78f55262' \
# -d '{"Password": "password", "NewPassword": "123123", "NewConfirmPassword": "123123"}'

curl -X POST "$url/user/changepassword" \
-H 'x-api-key:  d41d8cd98f00b204e9800998ecf8427e' \
-H 'Authorization: Bearer 8f501c50-b97e-11e8-96a6-f50b016f61b2' \
-d '{"Password": "password", "NewPassword": "password", "NewConfirmPassword": "password"}'