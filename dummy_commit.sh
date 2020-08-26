#!/bin/bash
# Script will create several commits with dummy data to test github actions

SLEEP_TIMEOUT=1

seq 1 5 | while read i; do
    echo "// dummy commit - $(date)" >>bench.js
    
    #   git add bench.js
    #   git commit -m "Dummy commit $i"
    #   git push
    sleep ${SLEEP_TIMEOUT}
done
