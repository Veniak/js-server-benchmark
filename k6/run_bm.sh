#!/bin/sh

# 
# This is a simple script to automate running the benchmarks
# 

curdir=$(pwd)
# Output directory
folder=extended

# SSH Data
SSH_KEY_LOCATION="~/.ssh/<key_file>"
SSH_CONNECTION=<user>@<host>

# Get all the tags for the benchmark images from local docker instance
tags=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep benchmark | awk -F: '{print $2}')
count=$(echo $tags | wc -w)

# time=35
# only one script
time=20
echo "Starting the benchmark for each tag"
echo "This will take approximately $time minutes per tag to complete"
echo "$count tags to benchmark $count * $time minutes = $(($count*$time)) minutes at least"

step=0

run_bm () {
  type=$1
  for tag in $tags; do
    step=$((step + 1))

    echo "Starting benchmark for tag $tag ($step/$count)"
    sys=$(awk -F- '{print $1}' <<< $tag)
    serv=$(awk -F- '{print $2}' <<< $tag)
    path=$folder/$sys/$serv
    mkdir -p $path 
    echo "Benchmark results will be stored in $path"
    if [ $step -gt 1 ]; then
      echo "Waiting for Server hardware to cool down to avoid thermal throttling to affect the benchmark"
      sleep 300
    fi

    # random hash to avoid caching of resouroces
    random=$(date +%s | sha256sum | base64 | head -c 32)

    echo "Start the benchmark server container"
    ssh -i $SSH_KEY_LOCATION $SSH_CONNECTION docker pull benchmark:$tag
    ssh -i $SSH_KEY_LOCATION $SSH_CONNECTION docker run --name benchmark-$random -d -p 30003:3000 benchmark:$tag

    echo $(date) - IMG - benchmark-$random - $tag >> $curdir/runs.txt

    echo "Wait for the benchmark server to start"
    sleep 15

    echo "Execute the k6 tests for the $type.js"
    k6 run $type.js -d 600s --summary-export=$path/$type.json

    echo "Stop and remove the benchmark server container"
    ssh -i $SSH_KEY_LOCATION $SSH_CONNECTION docker stop benchmark-$random
    ssh -i $SSH_KEY_LOCATION $SSH_CONNECTION docker rm benchmark-$random
  done

}

# run_bm "pdf"
run_bm "img"
