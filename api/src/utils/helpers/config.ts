import { ConfigType, ConnectionProfile } from '../types'
import { Wallet, Wallets } from 'fabric-network'

import * as path from 'path'
import * as fs from 'fs'

type ConfigReturnType = {
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
}
