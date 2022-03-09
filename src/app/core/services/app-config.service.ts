import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import config from "src/assets/orgsettings.json";
import authConfig from "src/assets/authsettings.json";
import { environment } from "src/environments/environment";
import { OrgConfig } from "@app/interfaces/org-config";
import { AuthConfig } from "@app/interfaces/auth-config";

@Injectable({
  providedIn: "root",
})
export class AppConfigService {
  constructor(private storage: Storage, private httpClient: HttpClient) {}

  private _orgConfig: OrgConfig;
  public get orgConfig() {
    return this._orgConfig;
  }

  private _authConfig: AuthConfig;
  public get authConfig() {
    return this._authConfig;
  }

  public async loadAuthConfig() {
    if (environment.production) {
      const config = await this.httpClient
        .get<AuthConfig>(
          "https://humanrisks-core-api.azurewebsites.net/api/mobileappsettings/getAuthConfig"
        )
        .toPromise();
      this._authConfig = config;
    } else {
      const config = await this.httpClient
        .get<AuthConfig>(
          "https://localhost:5000/api/mobileappsettings/getAuthConfig"
        )
        .toPromise();
      this._authConfig = config;
    }
  }

  /**
   * Get config from prod db if env is prod, otherwise read from appsetting
   * s.json.
   */
  public async loadConfig() {
    if (environment.production) {
      const config = await this.httpClient
        .get<OrgConfig>(
          "https://humanrisks-core-api.azurewebsites.net/api/mobileappsettings/getOrgConfig/hr"
        )
        .toPromise();
      this._orgConfig = config;
    } else {
      const config = await this.httpClient
        .get<OrgConfig>(
          "https://localhost:5000/api/mobileappsettings/getOrgConfig/hr"
        )
        .toPromise();
      this._orgConfig = config;
    }
  }

  public async setConfigFromOrgName(orgName: string) {
    if (environment.production) {
      const config = await this.httpClient
        .get<OrgConfig>(
          `https://humanrisks-core-api.azurewebsites.net/api/mobileappsettings/getOrgConfig/${orgName}`
        )
        .toPromise();
      this._orgConfig = config;
    } else {
      const config = await this.httpClient
        .get<OrgConfig>(
          `https://localhost:5000/api/mobileappsettings/getOrgConfig/${orgName}`
        )
        .toPromise();
      this._orgConfig = config;
    }
  }

  private async getCachedOrDefault(key: string, def: string) {
    return (await this.storage.get(key)) ?? def;
  }

  private async setCache(key: string, val: string) {
    await this.storage.set(key, val);
  }
}
