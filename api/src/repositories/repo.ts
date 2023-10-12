import { Gateway, GatewayOptions, Contract } from 'fabric-network'

import ConfigHelper from '../utils/helpers/config'

import * as path from 'path'
import * as fs from 'fs'

import { TextDecoder } from 'util'
import { ConnectionProfile } from '../utils/types'

const utf8Decoder = new TextDecoder()

// TODO: Make this singleton so that the connection will only be made once to save throughput
export default abstract class Repository {
  private contract: {
    [key: string]: Contract
  }

  constructor() {}

  // TODO: Add userID as parameter
  private async connectToContract(): Promise<void> {
    const configFile = await ConfigHelper.getConfigFile()
    const config = await ConfigHelper.getConfig()
    const gateway = new Gateway()

    const { organisation, user, channel } = configFile.chaincode.connection
    const ccpPath =
      configFile.chaincode.organisation[organisation].connectionProfile
    const ccp: ConnectionProfile = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

    const gatewayOpts: GatewayOptions = {
      wallet: config.wallet,
      identity: user,
      discovery: {
        asLocalhost: true,
        enabled: true,
      },
    }

    try {
      await gateway.connect(ccp, gatewayOpts)

      const network = await gateway.getNetwork(channel)

      const partyContract = network.getContract(
        'votenet',
        'PartyTransferContract'
      )
      const voteContract = network.getContract(
        'votenet',
        'VoteTransferContract'
      )
      const candidateContract = network.getContract(
        'votenet',
        'CandidateTransferContract'
      )

      this.contract = {
        party: partyContract,
        candidate: candidateContract,
        vote: voteContract,
      }
    } catch (error) {
      console.log(error.message)
      throw error
    } finally {
      gateway.disconnect()
    }
  }

  public async submitTransaction(
    contract: 'vote' | 'candidate' | 'party',
    transactionName: string,
    ...args: string[]
  ): Promise<object> {
    try {
      if (this.contract === null || this.contract === undefined)
        await this.connectToContract()

      const data = await this.contract[contract].submitTransaction(
        transactionName,
        ...args
      )

      return JSON.parse(utf8Decoder.decode(data))
    } catch (error) {
      throw error
    }
  }
}
