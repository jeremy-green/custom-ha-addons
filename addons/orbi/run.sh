#!/bin/bash
set -e

CONFIG_PATH=/data/options.json

ROUTER_USER=$(jq --raw-output ".router_user" $CONFIG_PATH)
ROUTER_PASS=$(jq --raw-output ".router_pass" $CONFIG_PATH)

TARGET_ROUTER_USER="$(bashio::config 'router_user')"
TARGET_ROUTER_PASS="$(bashio::config 'router_pass')"

env

node -v
npm -v

ls -la

npm run start
