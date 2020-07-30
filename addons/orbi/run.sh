#!/bin/bash
set -e

CONFIG_PATH=/data/options.json

ROUTER_USER="$(bashio::config 'router_user')"
ROUTER_PASS="$(bashio::config 'router_pass')"

env

node -v
npm -v

ls -la

npm run start
