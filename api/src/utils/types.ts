export type ConnectionProfile = {
  connectionProfile: string
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

export type Config = {
  chaincode: {
    organisation: {
      [key: string]: ConnectionProfile
    }
  }
  channels: string
  connection: ConnectionConfig
  initialised: boolean
}
