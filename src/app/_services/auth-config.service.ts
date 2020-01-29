import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AppConfig } from '../_settings/auth.config';
import { OAuthService } from 'angular-oauth2-oidc';
import { TokenService } from './token.service';
@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  appConfig: AppConfig = new AppConfig();

  constructor(private storage: Storage, private oAuthService: OAuthService) { }

  public async loadAppConfig() {
    var num_keys = await this.storage.length();
    var issuer = await this.storage.get("iss");
    console.log("number of keys " + num_keys);
    if (num_keys > 0 || issuer) {
      this.appConfig.clientId = await this.storage.get("client_id");
      this.appConfig.issuer = await this.storage.get("iss");
      this.appConfig.scope = await this.storage.get("scope");
      this.appConfig.logoutUrl = await this.storage.get("logout_url");
      this.appConfig.redirectUri = await this.storage.get("redirect_uri");
      this.appConfig.oidc = await this.storage.get("oidc");
      this.appConfig.apiUrl = await this.storage.get("api_url");
      this.apiBaseUrl;

      console.log("From DB -> clientId: " + this.appConfig.clientId);
      console.log("From DB -> issuer: " + this.appConfig.issuer);
      console.log("From DB -> scope: " + this.appConfig.scope);
      console.log("From DB -> logoutUrl: " + this.appConfig.logoutUrl);
      console.log("From DB -> redirectUri: " + this.appConfig.redirectUri);
      console.log("From DB -> oidc: " + this.appConfig.oidc);
      console.log("From DB -> apiBaseUrl: " + this.appConfig.apiUrl);
    } else {
      // Default auth configuration
      this.appConfig.issuer = "https://humanrisks-core-auth.azurewebsites.net";
      this.appConfig.redirectUri = "http://localhost:8100/callback";
      this.appConfig.logoutUrl = "https://humanrisks-core-auth.azurewebsites.net/account/logout";
      this.appConfig.clientId = "ionic";
      this.appConfig.oidc = false;
      this.appConfig.scope = "api";
      this.appConfig.apiUrl = "https://humanrisks-core-api.azurewebsites.net/"
      console.log("Default -> clientId: " + this.appConfig.clientId);
      console.log("Default -> issuer: " + this.appConfig.issuer);
      console.log("Default -> scope: " + this.appConfig.scope);
      console.log("Default -> logoutUrl: " + this.appConfig.logoutUrl);
      console.log("Default -> redirectUri: " + this.appConfig.redirectUri);
      console.log("Default -> oidc: " + this.appConfig.oidc);
      console.log("Default -> apiBaseUrl: " + this.appConfig.apiUrl);
    }
  }

  public get apiBaseUrl(): string {
    if (this.oAuthService.hasValidAccessToken()) {
      var token = this.oAuthService.getAccessToken();
      const tokens: Array<any> = token.split(".");
      const decoded = this.decodeB64(tokens[1]);
      const tokenPayload: any = JSON.parse(decoded);
      console.log("TokenPayload api_url: " + tokenPayload.apiurl);
      return tokenPayload.apiurl;
    } else {
      return null;
    }
  }

  public get issuer(): string {
    return this.appConfig.issuer;
  }

  public get redirectUri(): string {
    return this.appConfig.redirectUri;
  }

  public get logoutUrl(): string {
    return this.appConfig.logoutUrl;
  }

  public setAppConfig(tokenPayload: any) {
    console.log("Saving new authConfig");
    console.log("Saved from token -> clientId: " + tokenPayload.client_id);
    console.log("Saved from token -> issuer: " + tokenPayload.iss);
    console.log("Saved from token -> scope: " + tokenPayload.scope);
    console.log("Saved from token -> logoutUrl: " + tokenPayload.iss + "/account/logout");
    console.log("Saved from token -> redirectUri: " + "http://localhost:8100/callback");
    console.log("Saved from token -> oidc: " + "false");
    console.log("Saved from token -> apiBaseUrl: " + tokenPayload.apiurl);
    // Save auth config
    console.log("Api_url saved 1");
    this.storage.set("api_url", tokenPayload.apiurl);
    console.log("Api_url saved 2");
    this.storage.set("client_id", tokenPayload.client_id)
    this.storage.set("iss", tokenPayload.iss);
    this.storage.set("scope", tokenPayload.scope);
    this.storage.set("logout_url", tokenPayload.iss + "/account/logout");
    this.storage.set("redirect_uri", "http://localhost:8100/callback");
    this.storage.set("oidc", false);
    this.storage.get("api_url").then(url => { console.log("AppConfig is now saved!" + url) });
  }

  private decodeB64(payload: string) {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(payload), function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  }
}