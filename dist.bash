#!/bin/bash

set -euo pipefail

mkdir -p dist

PATH="$(npm bin):$PATH"

build () {
    local output=$1
    shift
    echo "Building dist/$output.js..."
    browserify -s dateTimezone -e index.js "${@}" -o dist/$output.js
    echo "Building dist/$output.min.js..."
    browserify -s dateTimezone -g uglifyify -e index.js "${@}" -o dist/$output.min.js
}

build date-timezone -x moment-timezone
build date-timezone-with-moment
