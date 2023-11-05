#!/bin/bash

# Import the exported variables
source ./variables.sh

# Function to handle errors
handle_error() {
  echo "Error occurred at line $1"
  exit 1
}

trap 'handle_error $LINENO' ERR

echo "Removing old wallets"
/bin/rm -rf $PWD/wallet/*

echo "Deinitialise config"
jq '. + { initialised: false }' "$CONFIG_PATH" > ./temp.json && mv ./temp.json "$CONFIG_PATH"

echo "Pull and relocate the test-network"
rm -rf fabric-samples
rm -rf test-network
rm -rf bin
rm -rf config
rm -rf builders

./install-fabric.sh

mv ./fabric-samples/test-network ./test-network
mv ./fabric-samples/bin ./bin
mv ./fabric-samples/builders ./builders
mv ./fabric-samples/config ./config
rm -rf ./fabric-samples

echo "Update OrdererType from solo to kafka"
awk '/OrdererType:/ && /solo/ {sub(/solo/, "kafka")} 1' ./config/configtx.yaml > temp.yaml
mv temp.yaml ./config/configtx.yaml

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

echo "Setting up the blockchain explorer"
./explorer.sh

echo -e "\nSuccessfully created two channels and it's peers and organisations!\n"

export FABRIC_PATH=$PWD