#!/bin/bash

set -e

tar -cvf routermenu.tar html/

sshpass -p "Wxy201310248!" scp ./routermenu.tar root@112.124.43.62:/tmp/
