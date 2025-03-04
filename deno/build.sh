#!/bin/sh

curdir=$(pwd)

directories=$(find $(pwd) -maxdepth 1 -type d | grep -e $(pwd).)

for dir in $directories; do
  echo "Building $(basename $dir)"
  cd $dir
  ./build.sh
done

cd $curdir