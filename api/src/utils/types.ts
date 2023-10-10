export type ConfigType = {
  connectionProfile: string
  appAdmin: string
  orgMSPID: string
  caName: string
  gatewayDiscovery: {
    enabled: boolean
    asLocalhost: boolean
  }
}

export type ConnectionProfile = {
  name: string;
  version: string;
  client: {
    organization: string;
    connection: {
      timeout: {
        peer: {
          endorser: string;
        };
      };
    };
  };
  organizations: {
    [key: string]: {
      mspid: string;
      peers: string[];
      certificateAuthorities: string[];
    };
  };
  peers: {
    [key: string]: {
      url: string;
      tlsCACerts: {
        pem: string;
      };
      grpcOptions: {
        'ssl-target-name-override': string;
        hostnameOverride: string;
      };
    };
  };
  certificateAuthorities: {
    [key: string]: {
      url: string;
      caName: string;
      tlsCACerts: {
        pem: string[];
      };
      httpOptions: {
        verify: boolean;
      };
    };
  };
};
