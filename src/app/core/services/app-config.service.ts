import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { AppConfig } from "../settings/auth.config";
import { OAuthErrorEvent, OAuthService } from "angular-oauth2-oidc";
import { JwksValidationHandler } from "angular-oauth2-oidc-jwks";
import { environment } from "@env";
import { AuthService } from "src/app/auth/auth.service";
import config from "src/assets/appsettings.json";

@Injectable({
  providedIn: "root",
})
export class AppConfigService {
  constructor(private storage: Storage) {}

  private _apiUrl: string;
  public get apiUrl() {
    return this._apiUrl;
  }

  private _apiKey: string;
  public get apiKey() {
    return this._apiKey;
  }

  public async loadConfig() {
    this.setApiUrl(await this.getCachedOrDefault("apiUrl", config.ApiServer));
    this.setGoogleApiKey(
      await this.getCachedOrDefault("apiKey", config.GoogleApiKey)
    );
  }

  private async setApiUrl(url: string) {
    this._apiUrl = url;
    await this.setCache("apiUrl", url);
  }

  private async setGoogleApiKey(key: string) {
    this._apiKey = key;
    await this.setCache("apiKey", key);
  }

  public async setConfigFromOrgName(orgName: string) {
    const config = this.getOrganizationConfig(orgName);
    await this.setApiUrl(config.apiUrl);
    await this.setGoogleApiKey(config.apiKey);
  }

  private async getCachedOrDefault(key: string, def: string) {
    return (await this.storage.get(key)) ?? def;
  }

  private async setCache(key: string, val: string) {
    await this.storage.set(key, val);
  }

  private getOrganizationConfig(
    orgName: string
  ): { apiUrl: string; apiKey: string } {
    switch (orgName) {
      case "humanrisks":
        return {
          apiUrl: "https://humanrisks-core-api.azurewebsites.net",
          apiKey: "AIzaSyCWqvwqWfwNMP84f_gHBq_YL8j43hKJB50",
        };
      case "lh":
        return {
          apiUrl: "https://localhost:5000",
          apiKey: "AIzaSyCWqvwqWfwNMP84f_gHBq_YL8j43hKJB50",
        };
      case "test":
        return {
          apiUrl: "test.com",
          apiKey: "AIzaSyCWqvwqWfwNMP84f_gHBq_YL8j43hKJB50",
        };
      default:
        return {
          apiUrl: "https://localhost:5000",
          apiKey: "AIzaSyCWqvwqWfwNMP84f_gHBq_YL8j43hKJB50",
        };
    }
  }
}
