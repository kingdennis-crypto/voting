echo "Removing old wallets"
/bin/rm -rf $PWD/wallet/*

# TODO: Also set NPM environment variable
echo "Setting environment variables"
export FABRIC_PATH=$PWD
export PATH=$(PWD)/bin:$PATH
export CORE_PEER_MSPCONFIGPATH=$(PWD)/../test-network/organizations/ordererOrganizations/example.com/msp

# export EXPLORER_CONFIG_FILE_PATH=./config.json
# export EXPLORER_PROFILE_DIR_PATH=./connection-profile
# export FABRIC_CRYPTO_PATH=./organizations

echo "Closing leftover channels"
$PWD/test-network/network.sh down

echo "Setup of channel"
$PWD/test-network/network.sh up createChannel -c mychannel -ca -s couchdb

echo "Deploying chaincode"
$PWD/test-network/network.sh deployCC -ccn votenet -ccp $PWD/chaincode -ccv 1 -ccl typescript

# TODO: Add a npm build and npm run

# echo "Installing blockchain explorer"
# cd $FABRIC_PATH
# git clone https://github.com/hyperledger/blockchain-explorer.git

# cp blockchain-explorer/examples/net1/config.json blockchain-explorer/connection-profile/first-network.json
# cp test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json blockchain-explorer/connection-profile/connection-profile.json

# cd blockchain-explorer
# npm install

# ./start.sh
