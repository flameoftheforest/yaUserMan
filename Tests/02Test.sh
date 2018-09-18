#!/bin/bash

url=""
apiKey=""
token=""

./testAddUser.test01.sh "$url" "$apiKey" "$token"

./testGetUser.sh "$url" "$apiKey" "$token"