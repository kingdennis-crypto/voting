import { Contract, Gateway, Network, Wallets } from 'fabric-network'
import { ConfigType, ConnectionProfile } from '../types'

import * as path from 'path'
import * as fs from 'fs'
import { ConnectedGatewayOptions } from 'fabric-network/lib/gateway'

type NetworkReturnType = {
  network: Network,
  gateway: Gateway,
  candidate: Contract,
  party: Contract,
  vote: Contract
}

export default class NetworkHelper {
  constructor() {}

  public static async connectToNetwork(userID: string) {
    try {
      const gateway = new Gateway()

      // Get the config
      const configPath = path.resolve('src', 'config.json')
      const config: ConfigType = JSON.parse(
        fs.readFileSync(configPath, 'utf-8')
      ) as ConfigType

      // Load the network configuration
      const ccpPath = path.resolve(
        process.env.FABRIC_PATH,
        config.connectionProfile
      )

      const ccp: ConnectionProfile = JSON.parse(
        fs.readFileSync(ccpPath, 'utf-8')
      ) as ConnectionProfile

      const walletPath = path.join(process.env.FABRIC_PATH, 'wallet')
      const wallet = await Wallets.newFileSystemWallet(walletPath)

      console.log('After wallet')

      const userCheck = await wallet.get(userID)
      if (!userCheck) {
        throw new Error(
          `An identity for the user ${userID} does not exist in the wallet`
        )
      }

      await gateway.connect(ccp, {
        wallet: wallet,
        identity: userID,
        discovery: config.gatewayDiscovery,
      })

      // Connect to our local fabric network
      const network = await gateway.getNetwork('mychannel')

      // Get the contract we have installed on the peer
      const candidateContract = network.getContract('CandidateTransfer')
      const partyContract = network.getContract('PartyTransfer')
      const voteContract = network.getContract('VoteTransfer')

      const data = {
        network: network,
        gateway: gateway,
        candidate: candidateContract,
        party: partyContract,
        vote: voteContract
      }

      return data
      // return { message: 'Hello' }
    } catch (error) {
      throw error
    }
  }
}
