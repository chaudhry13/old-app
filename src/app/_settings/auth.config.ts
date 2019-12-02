import { AuthConfig } from "angular-oauth2-oidc";
import { isDevMode } from "@angular/core";

export const authConfig: AuthConfig = {
	issuer: "https://test1auth.humanrisks.com/",
	redirectUri: "http://localhost:8100/callback",
	logoutUrl: "https://test1auth.humanrisks.com/account/logout",
	clientId: "ionic",
	oidc: false,
	scope: "api"
};

export const authConfigLocal: AuthConfig = {
	issuer: "https://localhost:5001",
	redirectUri: "http://localhost:8100/callback",
	logoutUrl: "https://localhost:5001/account/logout",
	clientId: "ionic",
	oidc: false,
	scope: "api"
};
