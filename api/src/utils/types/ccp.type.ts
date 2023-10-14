type ConnectionTimeout = {
  endorser: string
  eventHub?: string
  eventReg?: string
}

type ChannelPeers = Record<string, {}>

type ChannelConfig = {
  peers: ChannelPeers
  connection: {
    timeout: {
      peer: ConnectionTimeout
    }
  }
}

type OrganisationConfig = {
  mspid: string
  adminPrivateKey: {
    path: string
  }
  peers: string[]
  certificateAuthorities: string[]
  signedCert: {
    path: string
  }
}

type PeerConfig = {
  tlsCACerts: {
    path: string
  }
  url: string
  grpcOptions: {
    [key: string]: string
  }
}

type CertificateAuthorityConfig = {
  url: string
  httpOptions: {
    verify: boolean
  }
  tlsCACerts: {
    pem: string[]
  }
  caName: string
}

export type CcpConfig = {
  name: string
  version: string
  license: string
  client: {
    tlsEnable: boolean
    clientTlsIdentity: string
    caCredential: {
      id: string
      password: string
    }
    adminCredential: {
      id: string
      password: string
      affiliation: string
    }
    enableAuthentication: boolean
    organization: string
    connection: {
      timeout: {
        peer: ConnectionTimeout
      }
    }
  }
  channels: {
    [key: string]: ChannelConfig
  }
  organizations: {
    [key: string]: OrganisationConfig
  }
  peers: {
    [key: string]: PeerConfig
  }
  certificateAuthorities: {
    [key: string]: CertificateAuthorityConfig
  }
}
