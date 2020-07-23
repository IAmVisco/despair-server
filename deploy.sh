#!/bin/bash

set -o errexit

cd /opt/despair-server || { echo "No directory found"; exit 1; }

git pull

npm install

pm2 reload d-server
