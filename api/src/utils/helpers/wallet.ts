import { Wallets, Identity } from 'fabric-network'

import * as path from 'path'
import * as fs from 'fs'
import { ConnectionProfile } from '../types'
import FabricCAServices, {
  IEnrollmentRequest,
  IRegisterRequest,
} from 'fabric-ca-client'
import ConfigHelper from './config'
import { CcpConfig } from '../types/ccp.type'

export default class WalletHelper {
  constructor() {}

  // TODO: Change it so that there is an admin for both CA
  // public static async enrollAdmin() {
  //   try {
  //     const config = await ConfigHelper.getConfig()
  //     const caServices: FabricCAServices[] = []

  //     config.organisations.forEach((item) => {
  //       const _ccp = item.connectionProfile as CcpConfig
  //       const _caInfo = _ccp.certificateAuthorities[item.caName]
  //       const _pem = _caInfo.tlsCACerts.pem

  //       const ca = new FabricCAServices(
  //         _caInfo.url,
  //         { trustedRoots: _pem, verify: false },
  //         _caInfo.caName
  //       )
  //       caServices.push(ca)
  //     })

  //     // Check to see if we've already enrolled the admin user.
  //     const identity = await config.wallet.get('admin')
  //     if (identity) {
  //       throw new Error(
  //         'An identity for the admin user "admin" already exists in the wallet'
  //       )
  //     }

  //     caServices.forEach(async (service, index) => {
  //       const _enrollment = await service.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' })
  //       const x509Identity = {
  //         credentials: {
  //           certificate: _enrollment.certificate,
  //           privateKey: _enrollment.key.toBytes()
  //         },
  //         mspId: `Org${index}MSP`,
  //         type: 'X.509'
  //       }
  //     })
  //   } catch (error) {
  //     throw error
  //   }
  // }

  public static async enrollAdmin() {
    try {
      const config = await ConfigHelper.getConfig()
      const organisation = Object.values(config.organisations).at(0)

      // Create a new CA client for interacting with the CA
      const caInfo = (organisation.connectionProfile as CcpConfig)
        .certificateAuthorities[organisation.caName]
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
        enrollmentID: 'admin',
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

  public static async enrollUser(userId: string, role: string) {
    try {
      if (!(userId && role)) {
        throw new Error('All fields are mandatory')
      }

      // Get the config
      const config = await ConfigHelper.getConfig()
      const organisation = Object.values(config.chaincode.organisation)[0]

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
      const adminIdentity = await wallet.get('admin')
      if (!adminIdentity) {
        throw new Error(
          'An error for the admin user admin does not exist in the wallet'
        )
      }

      // Connection profile
      const cp = JSON.parse(
        fs.readFileSync(
          path.resolve('..', organisation.connectionProfile as string),
          'utf-8'
        )
      ) as CcpConfig

      const caURL = cp.certificateAuthorities[organisation.caName].url
      const ca = new FabricCAServices(caURL)

      // Build a user object for authenticating with the CA
      const provider = wallet
        .getProviderRegistry()
        .getProvider(adminIdentity.type)
      const adminUser = await provider.getUserContext(adminIdentity, 'admin')

      const user: IRegisterRequest = {
        affiliation: 'org1',
        enrollmentID: userId,
        role: role,
      }

      // Register the user, enroll the user, and import the new identity into the wallet
      const secret = await ca.register(user, adminUser)

      const enrollmentData: IEnrollmentRequest = {
        enrollmentID: userId,
        enrollmentSecret: secret,
      }

      const enrollment = await ca.enroll(enrollmentData)

      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org1MSP',
        type: 'X.509',
      }

      await wallet.put(userId, x509Identity)

      return
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  public static async deleteWallet(userId: string) {
    try {
      // Create a new file system based wallet for managing identities
      const walletPath = path.join(process.env.FABRIC_PATH, 'wallet')
      const wallet = await Wallets.newFileSystemWallet(walletPath)

      // Check to see if we've already enrolled the user
      const userCheck = await wallet.get(userId)
      if (!userCheck) {
        throw new Error(`The identity for the user ${userId} Doesn't exist`)
      }

      await wallet.remove(userId)
    } catch (error) {
      throw error
    }
  }

  public static async getWallets(): Promise<string[]> {
    try {
      const walletPath = path.join(process.env.FABRIC_PATH, 'wallet')
      const wallet = await Wallets.newFileSystemWallet(walletPath)

      return wallet.list()
    } catch (error) {
      throw error
    }
  }
}
