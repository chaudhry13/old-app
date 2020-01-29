import { AuthConfig } from "angular-oauth2-oidc";
import { isDevMode } from "@angular/core";

export class AppConfig extends AuthConfig {
  apiUrl: string;
  constructor() {
    super();
  }
}

export const authConfigDefault: AppConfig = {
  issuer: "https://auth.humanrisks.com",
  redirectUri: "http://localhost:8100/callback",
  logoutUrl: "https://auth.humanrisks.com/account/logout",
  clientId: "ionic",
  oidc: false,
  scope: "api",
  apiUrl: "https://humanrisks-core-api.azurewebsites.net"
};