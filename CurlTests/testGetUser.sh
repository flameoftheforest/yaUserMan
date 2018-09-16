#!/bin/bash

# url="https://1exvemgkdk.execute-api.ap-southeast-2.amazonaws.com/live"
url="http://localhost:3000"

curl "$url/user?email=testuser1@test.com&password" \
-H 'x-api-key:  d41d8cd98f00b204e9800998ecf8427e' \
-H 'Authorization: Bearer xx123yy123zz123'

# curl "$url/user?email=true" \
# -H 'x-api-key:  d41d8cd98f00b204e9800998ecf8427e' \
# -H 'Authorization: Bearer b41e69b0-b97e-11e8-96a6-f50b016f61b2'