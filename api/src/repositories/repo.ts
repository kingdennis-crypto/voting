import {
  Gateway,
  GatewayOptions,
  Contract,
  Wallets,
  ContractEvent,
} from 'fabric-network'

import ConfigHelper from '../utils/helpers/config'

import * as path from 'path'
import * as fs from 'fs'

import { TextDecoder } from 'util'
import { ConnectionProfile } from '../utils/types'
import { CcpConfig } from '../utils/types/ccp.type'
import WalletHelper from '../utils/helpers/wallet'
import SocketHelper from '../utils/helpers/socket'

import EventStrategies from 'fabric-network/lib/impl/event/defaulteventhandlerstrategies'

const utf8Decoder = new TextDecoder()

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

    const selectedOrg = config.connection.organisation
    const organisation = config.organisations.find(
      (org) => org.id === selectedOrg
    )

    const walletPath = path.resolve(process.env.FABRIC_PATH, 'wallet')
    const wallet = await Wallets.newFileSystemWallet(walletPath)

    if ((await wallet.list()).length === 0) {
      await WalletHelper.enrollAdmin()
      await WalletHelper.enrollUser('voter', 'voter')
    }

    // FIXME: If user is not admin we get a unauthorized access exception
    const gatewayOpts: GatewayOptions = {
      wallet: wallet,
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

      // FIXME: Events not working!
      const listener = async (event: ContractEvent) => {
        try {
          console.log(await event.getTransactionEvent(), await event.eventName)
        } catch (error) {
          console.error('Error in event listener:', error)
        }
      }

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
