import { Wallet, Wallets } from 'fabric-network'

import * as path from 'path'
import * as fs from 'fs'
import WalletHelper from './wallet'
import Repository from '../../repositories/repo'
import {
  Config,
  ConnectionProfile,
  OrganisationConfig,
} from '../types/config.type'
import { CcpConfig } from '../types/ccp.type'

type ConfigReturn = {
  organisations: ConnectionProfile[]
  wallet: Wallet
} & Config

export default class ConfigHelper {
  constructor() {}

  public static async getConfig(): Promise<ConfigReturn> {
    try {
      const configPath = path.resolve('src', 'config.json')
      const fabricPath = process.env.FABRIC_PATH
      const walletPath = path.resolve(fabricPath, 'wallet')

      const config: Config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
      const organisationsObjects: OrganisationConfig =
        config.chaincode.organisation

      const wallet = await Wallets.newFileSystemWallet(walletPath)

      const organisations = await Object.keys(organisationsObjects)
        .map((id) => ({ id, ...organisationsObjects[id] }))
        .map((item) => {
          const _path = path.resolve(
            fabricPath,
            item.connectionProfile as string
          )
          const _ccp: CcpConfig = JSON.parse(fs.readFileSync(_path, 'utf-8'))

          return { ...item, ccpPath: _path, connectionProfile: _ccp }
        })

      // console.log('ORG', organisations)

      const returnObj = { ...config, organisations: organisations, wallet }

      return returnObj
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

      // await WalletHelper.enrollAdmin()
      // await WalletHelper.enrollUser(userID, 'user')
    } catch (error) {
      throw error
    }
  }

  public static async setConnectionDetails(
    user: string,
    channel: string,
    organisation: string,
    peer: string
  ): Promise<void> {
    try {
      const configPath = path.resolve('src', 'config.json')
      const config: Config = JSON.parse(
        fs.readFileSync(configPath, 'utf-8')
      ) as any

      config.connection.user = user
      config.connection.channel = channel
      config.connection.organisation = organisation
      config.connection.peer = peer

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
      Repository.getInstance().connectToContract()
    } catch (error) {
      throw error
    }
  }
}
