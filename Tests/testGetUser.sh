#!/bin/bash

curl "$1/user" \
-H "x-api-key:  $2" \
-H "Authorization: Bearer $3" \
--verbose

curl "$1/user?email=test01@test.com" \
-H "x-api-key:  $2" \
-H "Authorization: Bearer $3" \
--verbose