#!/bin/bash

curl -X DELETE "$1/user" \
-H "Authorization: Bearer $3" \
-H "x-api-key:  $2" \
-d '{"Email": "test01@test.com"}'