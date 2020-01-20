import { AuthConfig } from "angular-oauth2-oidc";
import { isDevMode } from "@angular/core";

export const authConfigDefault: AuthConfig = {
  issuer: "https://test1auth.humanrisks.com",
  redirectUri: "http://localhost:8100/callback",
  logoutUrl: "https://test1auth.humanrisks.com/account/logout",
  clientId: "ionic",
  oidc: false,
  scope: "api"
};