import { CcpConfig } from './ccp.type'

export type ConnectionProfile = {
  id?: string
  connectionProfile: string | CcpConfig
  caName: string
  orgMSPID: string
}

export type ConnectionConfig = {
  user: string
  peer: string
  organisation: string
  channel: string
  gatewayDiscovery: {
    enabled: boolean
    asLocalhost: boolean
  }
}

export type OrganisationConfig = Record<string, ConnectionProfile>

export type Config = {
  chaincode: {
    organisation: OrganisationConfig
  }
  channels: string
  connection: ConnectionConfig
  initialised: boolean
}
