export interface OrgConfig {
  apiServer: string;
  googleApiKey: string;
  auth0OrgId: string;
  authServer: string;
  clientId: string;
  apiAudience: string;
  logoutUrl: string;
  authFlow: 'CODE' | 'IMPLICIT';
  useDiscovery: boolean;
  loginUrl: string;
  pubKeyUrl: string;
  tokenUrl: string;
  revocationUrl: string;
  kid: string;
  silentRefresh: boolean;
}
