import { Gateway, GatewayOptions, Contract } from 'fabric-network'

import ConfigHelper from '../utils/helpers/config'

import * as path from 'path'
import * as fs from 'fs'

import { TextDecoder } from 'util'
import { ConnectionProfile } from '../utils/types'
import { CcpConfig } from '../utils/types/ccp.type'
import WalletHelper from '../utils/helpers/wallet'

const utf8Decoder = new TextDecoder()

// TODO: Make this singleton so that the connection will only be made once to save throughput
export default class Repository {
  private static instance: Repository

  private contract: { [key: string]: Contract }

  private constructor() {}

  public static getInstance(): Repository {
    if (!Repository.instance) {
      Repository.instance = new Repository()
      Repository.instance.connectToContract()
    }

    return Repository.instance
  }

  public async connectToContract(): Promise<void> {
    const gateway = new Gateway()
    const config = await ConfigHelper.getConfig()
    const organisation = config.organisations[0]

    if ((await config.wallet.list()).length === 0) {
      await WalletHelper.enrollAdmin()
    }

    const gatewayOpts: GatewayOptions = {
      wallet: config.wallet,
      identity: config.connection.user,
      discovery: {
        asLocalhost: true,
        enabled: true,
      },
    }

    try {
      await gateway.connect(
        organisation.connectionProfile as CcpConfig,
        gatewayOpts
      )

      const network = await gateway.getNetwork(config.connection.channel)

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

      const contractObj: Contract = this.contract[contract]
      const data: ArrayBuffer = await contractObj.submitTransaction(
        transactionName,
        ...args
      )

      return JSON.parse(utf8Decoder.decode(data))
    } catch (error) {
      throw error
    }
  }
}
