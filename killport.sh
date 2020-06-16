#!/bin/bash

port="8081"
[[ $1 ]] && port="$1"

echo kill -9 $(lsof -t -i:$port)
kill -9 $(lsof -t -i:$port)
