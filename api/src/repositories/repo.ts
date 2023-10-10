import { Gateway, GatewayOptions, Network, Wallets, Contract } from 'fabric-network'

import NetworkHelper from '../utils/helpers/network'
import ConfigHelper from '../utils/helpers/config'

import { inspect } from 'util';

import * as path from 'path'
import * as fs from 'fs'
import * as crypto from 'crypto'
import * as grpc from '@grpc/grpc-js'

import {
  Identity,
  signers,
  connect,
  GatewayError,
} from '@hyperledger/fabric-gateway'
import { TextDecoder } from 'util'

const utf8Decoder = new TextDecoder()

// TODO: Make this singleton so that the connection will only be made once to save throughput
export default abstract class Repository {
  private contract: Contract

  constructor() {}

  // TODO: Add userID as parameter
  private async connectToContract(): Promise<void> {
    const config = await ConfigHelper.getConfig()

    const gateway = new Gateway()
    const gatewayOpts: GatewayOptions = {
      wallet: config.wallet,
      identity: 'dennis',
      discovery: {
        asLocalhost: true,
        enabled: true
      }
    }

    try {
      await gateway.connect(config.ccp, gatewayOpts)

      const network = await gateway.getNetwork('mychannel')
      const contract = network.getContract('votenet');

      this.contract = contract;
    } catch (error) {
      console.log(error.message)
    } finally {
      gateway.disconnect()
    }
  }

  public async submitTransaction(
    transactionName: string,
    userID: string | null,
    ...args: string[]
  ): Promise<object> {
    try {
      if (this.contract === null || this.contract === undefined)
        await this.connectToContract()

      const data = await this.contract.submitTransaction(transactionName, ...args)
      return JSON.parse(utf8Decoder.decode(data))
    } catch (error) {
      throw error
    }
  }
}
