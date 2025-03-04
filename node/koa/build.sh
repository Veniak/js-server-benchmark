#!/bin/bash

curdir=$(pwd)

cd $curdir/../../backends/node

pnpm install --frozen-lockfile
pnpm run build

filename=$(pnpm pack)
filelocation=$(pwd)/$filename

cd $curdir

mv $filelocation ./

name=$(basename $(pwd))
docker build -t benchmark:node-$name .

rm $filename