#!/bin/bash

set -euo pipefail

mkdir -p dist

PATH="$(npm bin):$PATH"

build () {
    local output=$1
    shift
    echo "Building dist/$output..."
    browserify -s dateTimezone -t uglifyify -e index.js "${@}" -o dist/$output
}

build date-timezone.js -x moment-timezone
build date-timezone-with-moment.js
