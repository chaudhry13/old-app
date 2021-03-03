import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { AppConfig } from "../settings/auth.config";
import { OAuthErrorEvent, OAuthService } from "angular-oauth2-oidc";
import { JwksValidationHandler } from "angular-oauth2-oidc-jwks";
import { environment } from "@env";

@Injectable({
  providedIn: "root",
})
export class AppConfigService {
  appConfig: AppConfig = new AppConfig();

  // TODO: GENERAL
  // - Find a solution to use environment.xxx instead of hardcoded in the code.
  // - This service should NOT be called as often. There is no need to.
  // - Create an app config class separate from Auth config

  constructor(private storage: Storage,
    private auth: OAuthService) {
  }

  public setAppConfig(tokenPayload: any) {
    this.saveToStorage(tokenPayload);
    this.tokenPayloadToAppConfig(tokenPayload);
  }

  private tokenPayloadToAppConfig(tokenPayload: any) {
    this.appConfig.clientId = tokenPayload.client_id;
    this.appConfig.issuer = tokenPayload.iss;
    this.appConfig.scope = tokenPayload.scope;
    this.appConfig.logoutUrl = tokenPayload.iss + "/account/logout";
    this.appConfig.redirectUri = "http://localhost:8100/callback";
    this.appConfig.oidc = tokenPayload.oidc;
    this.appConfig.apiUrl = tokenPayload.apiurl;
    this.auth.configure(this.appConfig);
  }

  private saveToStorage(tokenPayload: any) {
    this.storage.set("api_url", tokenPayload.apiurl);
    this.storage.set("client_id", tokenPayload.client_id);
    this.storage.set("iss", tokenPayload.iss);
    this.storage.set("scope", tokenPayload.scope);
    this.storage.set("logout_url", tokenPayload.iss + "/account/logout");
    this.storage.set("redirect_uri", "http://localhost:8100/callback");
    this.storage.set("oidc", false);
  }

  public async loadAppConfig() {
    let num_keys = await this.storage.length();
    let issuer = await this.storage.get("iss");
    if (num_keys > 0 || issuer) {
      this.appConfig.clientId = await this.storage.get("client_id");
      this.appConfig.issuer = await this.storage.get("iss");
      this.appConfig.scope = await this.storage.get("scope");
      this.appConfig.logoutUrl = await this.storage.get("logout_url");
      this.appConfig.redirectUri = await this.storage.get("redirect_uri");
      this.appConfig.oidc = await this.storage.get("oidc");
      this.appConfig.apiUrl = await this.storage.get("api_url");
      if (this.appConfig.apiUrl == null) {
        this.setDefaults();
      }
    } else {
      this.setDefaults();
    }
  }

  private setDefaults() {
    console.debug("setting defaults");
    this.appConfig.apiUrl = "https://humanrisks-core-api.azurewebsites.net/";
    this.appConfig.issuer = "https://humanrisks-core-auth.azurewebsites.net";
    this.appConfig.redirectUri = "http://localhost:8100/callback";
    this.appConfig.logoutUrl =
      "https://humanrisks-core-auth.azurewebsites.net/account/logout";
    this.appConfig.clientId = "ionic";
    this.appConfig.oidc = false;
    this.appConfig.scope = "api";
  }

  public get getApiBaseUrl(): string {
    if (this.auth.hasValidAccessToken()) {
      var token = this.auth.getAccessToken();
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

  public get scope(): string {
    return this.appConfig.scope;
  }

  public get logoutUrl(): string {
    return this.appConfig.logoutUrl;
  }

  public get organizationId(): string {
    if (this.auth.hasValidAccessToken()) {
      var token = this.auth.getAccessToken();
      const tokens: Array<any> = token.split(".");
      const decoded = this.decodeB64(tokens[1]);
      const tokenPayload: any = JSON.parse(decoded);
      return tokenPayload.organization;
    } else {
      return null;
    }
  }

  configureImplicitFlowAuthentication() {
    this.auth.configure(this.appConfig);
    this.auth.setStorage(localStorage);
    this.auth.tokenValidationHandler = new JwksValidationHandler();
    console.debug("issuer here");
    console.log(this.auth.issuer);
    console.log(this.appConfig);
    this.auth.loadDiscoveryDocumentAndTryLogin().then(success => {
      console.debug("Login Successful: " + success);
    }).catch(() => {
      console.debug("something went wrong in trylogin");
    })
    this.auth.events.subscribe((e) => {
      if (!environment.production) {
        if (e instanceof OAuthErrorEvent) {
          console.error(e.reason);
        }
      }
    });
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
