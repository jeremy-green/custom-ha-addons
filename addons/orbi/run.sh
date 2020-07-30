#!/bin/bash
set -e

CONFIG_PATH=/data/options.json

env

node -v
npm -v

ls -la

ROUTER_USER=$(jq --raw-output ".router_user" $CONFIG_PATH) \
ROUTER_PASS=$(jq --raw-output ".router_pass" $CONFIG_PATH) \
npm run start
