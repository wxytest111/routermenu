#!/bin/bash

set -e

tar -cvf routermenu.tar html/

scp ./routermenu.tar root@112.124.43.62:/tmp/
