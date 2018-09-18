#!/bin/bash

curl -X POST "$1/user/login" \
-H "x-api-key: $2" \
-d "{\"Email\": \"$3\", \"Password\": \"$4\"}"