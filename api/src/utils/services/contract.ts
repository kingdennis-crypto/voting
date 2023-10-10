import { Contract } from '@hyperledger/fabric-gateway'
import { Gateway, GatewayOptions } from 'fabric-network'

const utf8Decoder = new TextDecoder()

export default class ContractService {
  private static instance: ContractService
  private static gateway: Gateway

  constructor() {
    this.connect()
  }

  // private parseJson(jsonBytes: Uint8Array): unknown {
  //   const json = utf8Decoder.decode(jsonBytes)
  //   return JSON.parse(json)
  // }

  public async connect() {
    const wallet: any = null

    const gatewayOpts: GatewayOptions = {
      wallet: wallet,
      identity: '1',
      // Using asLocalhost as this gateway is using a fabric network deployed locally
      discovery: { enabled: true, asLocalhost: true },
    }

    try {
      await gate
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      ContractService.gateway.disconnect()
    }
  }

  public async createAsset(
    contract: Contract,
    contractFunction: string,
    contractArgs: string[]
  ) {
    console.log(`Subit transaction: ${contractFunction}, id`)

    const result = await contract.submitAsync(contractFunction, {
      arguments: contractArgs,
    })

    const status = await result.getStatus()

    if (!status.successful) {
      throw new Error(
        `Failed to commit transaction ${status.transactionId} with status code ${status.code}`
      )
    }

    console.log('Asset commited successfully')

    return status.blockNumber
  }

  public async updateAsset(
    contract: Contract,
    contractFunction: string,
    contractArgs: string[]
  ) {
    await contract.submitTransaction(contractFunction, ...contractArgs)
    console.log('Updated the asset successfully')
  }

  public async deleteById(
    contract: Contract,
    contractFunction: string,
    id: string
  ) {
    await contract.submitTransaction(contractFunction, id)
    console.log('Deleted the asset successfully')
  }

  public static getInstance(): ContractService {
    if (!ContractService.instance) {
      ContractService.instance = new ContractService()
    }

    return ContractService.instance
  }

  public static getGateway(): Gateway {
    return this.gateway
  }
}
