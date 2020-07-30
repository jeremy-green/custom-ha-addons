#!/bin/bash
set -e


env

node -v
npm -v

ls -la

CONFIG_PATH=/data/options.json \
ROUTER_USER=$(jq --raw-output ".router_user" $CONFIG_PATH) \
ROUTER_PASS=$(jq --raw-output ".router_pass" $CONFIG_PATH) \
npm run start
