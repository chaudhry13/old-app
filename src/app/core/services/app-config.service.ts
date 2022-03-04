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

  public async loadConfig() {
    this.setApiUrl(await this.getCachedOrDefault("apiUrl", config.ApiServer));
  }

  public async setUrlFromOrgName(orgName: string) {
    const url = this.getOrganizationConfig(orgName).apiUrl;
    await this.setApiUrl(url);
  }

  private async setApiUrl(url: string) {
    this._apiUrl = url;
    await this.setCache("apiUrl", url);
  }

  private async getCachedOrDefault(key: string, def: string) {
    return (await this.storage.get(key)) ?? def;
  }

  private async setCache(key: string, val: string) {
    await this.storage.set(key, val);
  }

  private getOrganizationConfig(orgName: string): { apiUrl: string } {
    switch (orgName) {
      case "humanrisks":
        return {
          apiUrl: "https://humanrisks-core-api.azurewebsites.net",
        };
      case "test":
        return {
          apiUrl: "test.com",
        };
      default:
        return {
          apiUrl: "https://humanrisks-core-api.azurewebsites.net",
        };
    }
  }
}
