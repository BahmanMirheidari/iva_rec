#!/bin/bash

command=start
[[ $1 == "stop" ]] && command=stop
[[ $1 == "status" ]] && command=status

sudo systemctl "$command" digital_doctor
