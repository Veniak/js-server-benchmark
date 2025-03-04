#!/bin/bash

cp -r ../../backends/deno/src ./tmp

name=$(basename $(pwd))
docker build -t benchmark:deno-$name .

rm -rf ./tmp