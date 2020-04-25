import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AppConfig } from '../_settings/auth.config';
import { OAuthService, JwksValidationHandler, OAuthErrorEvent } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  appConfig: AppConfig = new AppConfig();

  constructor(private storage: Storage, private oAuthService: OAuthService) { }

  public async loadAppConfig() {
    var num_keys = await this.storage.length();
    var issuer = await this.storage.get("iss");
    if (num_keys > 0 || issuer) {
      this.appConfig.clientId = await this.storage.get("client_id");
      this.appConfig.issuer = await this.storage.get("iss");
      this.appConfig.scope = await this.storage.get("scope");
      this.appConfig.logoutUrl = await this.storage.get("logout_url");
      this.appConfig.redirectUri = await this.storage.get("redirect_uri");
      this.appConfig.oidc = await this.storage.get("oidc");
      this.appConfig.apiUrl = await this.storage.get("api_url");
      this.getApiBaseUrl;
    } else {
      // Default auth configuration
      this.appConfig.apiUrl = "https://humanrisks-core-api.azurewebsites.net/"
      this.appConfig.issuer = "https://humanrisks-core-auth.azurewebsites.net";
      this.appConfig.redirectUri = "http://localhost:8100/callback";
      this.appConfig.logoutUrl = "https://humanrisks-core-auth.azurewebsites.net/account/logout";
      this.appConfig.clientId = "ionic";
      this.appConfig.oidc = false;
      this.appConfig.scope = "api";
    }
  }

  public get getApiBaseUrl(): string {
    if (this.oAuthService.hasValidAccessToken()) {
      var token = this.oAuthService.getAccessToken();
      const tokens: Array<any> = token.split(".");
      const decoded = this.decodeB64(tokens[1]);
      const tokenPayload: any = JSON.parse(decoded);
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
    // Save auth config
    this.storage.set("api_url", tokenPayload.apiurl);
    this.storage.set("client_id", tokenPayload.client_id)
    this.storage.set("iss", tokenPayload.iss);
    this.storage.set("scope", tokenPayload.scope);
    this.storage.set("logout_url", tokenPayload.iss + "/account/logout");
    this.storage.set("redirect_uri", "http://localhost:8100/callback");
    this.storage.set("oidc", false);
  }

  configureImplicitFlowAuthentication() {
    this.oAuthService.configure(this.appConfig);
    this.oAuthService.setStorage(localStorage);
    this.oAuthService.tokenValidationHandler = new JwksValidationHandler();
    this.oAuthService.loadDiscoveryDocument();
    this.oAuthService.events.subscribe(e => (e instanceof OAuthErrorEvent ? console.error(e.reason) : console.warn(e)));
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