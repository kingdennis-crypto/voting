#!/bin/bash

# Function to handle errors
handle_error() {
  echo "Error occurred at line $1"
  exit 1
}

trap 'handle_error $LINENO' ERR

CONFIG_PATH="./api/src/config.json"

echo "Removing old wallets"
/bin/rm -rf $PWD/wallet/*

echo "Deinitialise config"
jq '. + { initialised: false }' "$CONFIG_PATH" > ./temp.json && mv ./temp.json "$CONFIG_PATH"

# # TODO: Also set NPM environment variable
echo "Setting environment variables"
export FABRIC_PATH=$PWD
export FABRIC_CFG_PATH=$(PWD)/config
export PATH=$(PWD)/bin:$PATH
export CORE_PEER_MSPCONFIGPATH=$(PWD)/test-network/organizations/ordererOrganizations/example.com/msp

echo "Closing leftover channels"
$PWD/test-network/network.sh down

echo "Setup of channel"
$PWD/test-network/network.sh up createChannel -c election1 -ca -s couchdb

echo "Deploying chaincode"
$PWD/test-network/network.sh deployCC -c election1 -ccn votenet -ccp $PWD/chaincode -ccv 1 -ccl typescript

echo "Setting up second channel"
$PWD/test-network/network.sh up createChannel -c election2 -ca -s couchdb

echo "Deploying chaincode to second channel"
$PWD/test-network/network.sh deployCC -c election2 -ccn votenet -ccp $PWD/chaincode -ccv 1 -ccl typescript

echo -e "\nSuccessfully created two channels and it's peers and organisations!\n"