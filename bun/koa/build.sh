#!/bin/bash

cp -r ../../backends/bun ./

name=$(basename $(pwd))
docker build -t benchmark:bun-$name .

rm -rf ./bun