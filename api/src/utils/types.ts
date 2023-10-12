export type ConfigType = {
  connectionProfile: string
  appAdmin: string
  orgMSPID: string
  caName: string
  gatewayDiscovery: {
    enabled: boolean
    asLocalhost: boolean
  }
  organisations: {
    [key: string]: {
      connectionProfile: string
      caName: string
      orgMSPID: string
    }
  }
}

export type ConnectionProfile = {
  name: string
  version: string
  client: {
    organization: string
    connection: {
      timeout: {
        peer: {
          endorser: string
        }
      }
    }
  }
  organizations: {
    [key: string]: {
      mspid: string
      peers: string[]
      certificateAuthorities: string[]
    }
  }
  peers: {
    [key: string]: {
      url: string
      tlsCACerts: {
        pem: string
      }
      grpcOptions: {
        'ssl-target-name-override': string
        hostnameOverride: string
      }
    }
  }
  certificateAuthorities: {
    [key: string]: {
      url: string
      caName: string
      tlsCACerts: {
        pem: string[]
      }
      httpOptions: {
        verify: boolean
      }
    }
  }
}

export type Config = {
  chaincode: {
    organisation: {
      [key: string]: {
        connectionProfile: string
        caName: string
        orgMSPID: string
      }
    }
    connection: {
      gatewayDiscovery: {
        enabled: boolean
        asLocalhost: boolean
      }
      user: string
      peer: string
      organisation: string
      channel: string
    }
  }
  initialised: boolean
}
