#!/bin/bash

export CONFIG_PATH="./explorer/config.json"
export ADMIN_PRIV_KEY_PATH=""
export SIGNED_CERT_PATH=""

export EXPLORER_CONFIG_FILE_PATH=./config.json
export EXPLORER_PROFILE_DIR_PATH=./connection-profile
export FABRIC_CRYPTO_PATH=./organizations

export CONFIG_PATH="./api/src/config.json"

export FABRIC_PATH=$PWD
export FABRIC_CFG_PATH=$PWD/config
export PATH=$PWD/bin:$PATH
export CORE_PEER_MSPCONFIGPATH=$PWD/test-network/organizations/ordererOrganizations/example.com/msp

export OLD_CHANNEL="mychannel"
export NEW_CHANNEL="election1"