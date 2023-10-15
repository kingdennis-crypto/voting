#!/bin/bash

# Import the exported variables
source ./variables.sh

# CONFIG_PATH="./explorer/config.json"
# ADMIN_PRIV_KEY_PATH=""
# SIGNED_CERT_PATH=""

echo "Stopping the old explorer containers"
cd ./explorer2
docker compose down
cd ../

echo "Removing the old explorer folder"
rm -rf ./explorer2

echo "Creating the explorer dir"
mkdir explorer2
cd explorer2

echo "Downloading the correct files"
wget https://raw.githubusercontent.com/hyperledger/blockchain-explorer/main/examples/net1/config.json
wget https://raw.githubusercontent.com/hyperledger/blockchain-explorer/main/examples/net1/connection-profile/test-network.json -P connection-profile
wget https://raw.githubusercontent.com/hyperledger/blockchain-explorer/main/docker-compose.yaml

echo "Changing the values for our wanted outcome"
echo "PORT=8080" > .env
echo "EXPLORER_CONFIG_FILE_PATH=./examples/net1/config.json" >> .env
echo "EXPLORER_PROFILE_DIR_PATH=./examples/net1/connection-profile" >> .env
echo "FABRIC_CRYPTO_PATH=/fabric-path/fabric-samples/test-network/organizations" >> .env

echo "Copying the organizations folder to the explorer folder"
cp -r ../test-network/organizations ./organizations

echo "Replacing the connection values"
cd ../test-network/organizations
ADMIN_PRIV_KEY_PATH="/tmp/crypto/$(find "peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore" -type f -print -quit)"
SIGNED_CERT_PATH="/tmp/crypto$(find "peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts" -type f -print -quit)"
cd ../../explorer2/connection-profile

jq --arg new_path "$ADMIN_PRIV_KEY_PATH" \
   --arg new_cert "$SIGNED_CERT_PATH" \
   '.organizations.Org1MSP.adminPrivateKey.path = $new_path |
    .organizations.Org1MSP.signedCert.path = $new_cert' \
    test-network.json > temp.json && mv temp.json test-network.json

echo "Start the docker containers"
cd ../
docker compose up -d