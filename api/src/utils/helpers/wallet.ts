import { Wallets, Gateway, Wallet } from 'fabric-network'

import * as path from 'path'
import * as fs from 'fs'
import { ConfigType, ConnectionProfile } from '../types'
import FabricCAServices from 'fabric-ca-client'
import ConfigHelper from './config'

export default class WalletHelper {
  constructor() {}

  public static async enrollAdmin() {
    try {
      const config = await ConfigHelper.getConfig()

      // Create a new CA client for interacting with the CA
      const caInfo = config.ccp.certificateAuthorities[config.config.caName]
      const caTLSCACerts = caInfo.tlsCACerts.pem
      const ca = new FabricCAServices(
        caInfo.url,
        { trustedRoots: caTLSCACerts, verify: false },
        caInfo.caName
      )

      // Check to see if we've already enrolled the admin user.
      const identity = await config.wallet.get('admin')
      if (identity) {
        throw new Error(
          'An identity for the admin user "admin" already exists in the wallet'
        )
      }

      // Enroll the admin user, and import the new identity into the wallet
      const enrollment = await ca.enroll({
        enrollmentID: config.config.appAdmin,
        enrollmentSecret: 'adminpw',
      })

      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org1MSP',
        type: 'X.509',
      }

      // Add identity to the wallet
      await config.wallet.put('admin', x509Identity)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  public static async enrollUser(userId: string, name: string, role: string) {
    try {
      if (!(userId && name && role)) {
        throw new Error('All fields are mandatory')
      }

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

      // Create a new file system based wallet for managing identities
      const walletPath = path.join(process.env.FABRIC_PATH, 'wallet')
      const wallet = await Wallets.newFileSystemWallet(walletPath)

      // Check to see if we've already enrolled the user
      const userCheck = await wallet.get(userId)
      if (userCheck) {
        throw new Error(
          `Error! An identity for the user ${userId} already exists in the wallet. Please enter a different id`
        )
      }

      // Check to see if we've already enrolled the admin user
      const adminIdentity = await wallet.get(config.appAdmin)
      if (!adminIdentity) {
        throw new Error(
          `An error for the admin user ${config.appAdmin} does not exist in the wallet`
        )
      }

      // Create a new CA client for interacting with the CA
      const caURL = ccp.certificateAuthorities[config.caName].url
      const ca = new FabricCAServices(caURL)

      // Build a user object for authenticating with the CA
      const provider = wallet
        .getProviderRegistry()
        .getProvider(adminIdentity.type)
      const adminUser = await provider.getUserContext(adminIdentity, 'admin')

      const user = {
        affiliation: 'org1',
        enrollmentID: userId,
        role: 'client',
        attrs: [
          { name: 'id', value: userId, ecert: true },
          { name: 'name', value: name, ecert: true },
          { name: 'role', value: role, ecert: true },
        ],
      }

      // Register the user, enroll the user, and import the new identity into the wallet
      const secret = await ca.register(user, adminUser)

      const enrollmentData = {
        enrollmentID: userId,
        enrollmentSecret: secret,
        attr_reqs: [
          { name: 'id', optional: false },
          { name: 'name', optional: false },
          { name: 'role', optional: false },
        ],
      }

      const enrollment = await ca.enroll(enrollmentData)
      console.log(enrollment.certificate)

      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org1MSP',
        type: 'X.509',
      }

      await wallet.put(userId, x509Identity)
    } catch (error) {
      throw error
    }
  }
}
