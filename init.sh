#!/bin/bash

set -e

YEAR=$1
DAY=$2
mkdir -p $YEAR
cp -r -n __template/ $YEAR/$DAY