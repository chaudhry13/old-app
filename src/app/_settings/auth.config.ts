import { AuthConfig } from "angular-oauth2-oidc";
import { isDevMode } from "@angular/core";

export const authConfig: AuthConfig = {
	issuer: "https://localhost:5001",
	redirectUri: "http://localhost:8100/callback",
	logoutUrl: "https://humanrisks-core-auth.azurewebsites.net/account/logout",
	clientId: "ionic",
	oidc: false,
	scope: "api"
};
