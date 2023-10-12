import { Config, ConfigType, ConnectionProfile } from '../types'
import { Wallet, Wallets } from 'fabric-network'

import * as path from 'path'
import * as fs from 'fs'
import WalletHelper from './wallet'

export type ConfigReturnType = {
  config: ConfigType
  ccp: ConnectionProfile
  wallet: Wallet
}

export default class ConfigHelper {
  constructor() {}

  public static async getConfig(userID?: string): Promise<ConfigReturnType> {
    // Get the config data
    const configPath = path.resolve('src', 'config.json')
    const config: ConfigType = JSON.parse(
      fs.readFileSync(configPath, 'utf-8')
    ) as ConfigType

    // Get the ccp data
    const ccpPath = path.resolve(
      process.env.FABRIC_PATH,
      config.connectionProfile
    )
    const ccp: ConnectionProfile = JSON.parse(
      fs.readFileSync(ccpPath, 'utf-8')
    ) as ConnectionProfile

    const walletPath = path.join(process.env.FABRIC_PATH, 'wallet')
    const wallet = await Wallets.newFileSystemWallet(walletPath)

    return { config, ccp, wallet }
  }

  public static async getConfigFile(): Promise<Config> {
    try {
      const configPath = path.resolve('src', 'config.json')
      const config: Config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))

      return config
    } catch (error) {
      throw error
    }
  }

  public static async initialise(userID: string): Promise<void> {
    try {
      const configPath = path.resolve('src', 'config.json')
      const config: Config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))

      config.initialised = true

      // TODO: Make a function to get the organisation information for the config.json
      // const organisations: string[] = fs.readdirSync(
      //   // path.resolve('test-network', 'organizations', 'peerOrganizations')
      //   path.resolve('..', 'peerOrganizations')
      // )

      // console.log(organisations)

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2))

      await WalletHelper.enrollAdmin()
      await WalletHelper.enrollUser(userID, userID, 'user')
    } catch (error) {
      throw error
    }
  }

  public static async setConnectionDetails(
    user: string,
    peer: string,
    organisation: string,
    channel: string
  ): Promise<void> {
    try {
      const configPath = path.resolve('src', 'config.json')
      const config: Config = JSON.parse(
        fs.readFileSync(configPath, 'utf-8')
      ) as Config

      config.chaincode.connection.user = user
      config.chaincode.connection.peer = peer
      config.chaincode.connection.organisation = organisation
      config.chaincode.connection.channel = channel

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    } catch (error) {
      throw error
    }
  }
}
