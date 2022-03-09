import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { environment } from "src/environments/environment";
import { OrgConfig } from "@app/interfaces/org-config";
import { AuthConfig } from "@app/interfaces/auth-config";

/**
 * Ideally we would want to use environment variables to load initial configuration of Auth/Tenants. For the app build we would need
 * to set env variables seperatly for IOS and Android. We also dont want to wait for the app to be approved to change configs. Therefore
 * our current solution is to store env variables in the prod database, and fetch them from there before app init. Since we cannot know
 * our endpoints before we get the config (which contains the specific endpoint), we need to directly call our prod api for the config file,
 * without any access token. Since the env variables cannot contain secrets on a public client anyway, these config variables dont need to be hidden
 * behind an access token, instead we will just use an API key, for minimal security. Further, since we only have 1 app, and we cannot specify all of the
 * tenant specific urls in environment variables, we also need to fetch them dynamically depending on which organization the tenant requests through the app.
 * We call the production db in an identical way, and update the config variables.
 */

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
          "https://humanrisks-core-api.azurewebsites.net/api/mobileappsettings/getAuthConfig",
          {
            headers: { "x-api-key": "hrmobilekey" },
          }
        )
        .toPromise();
      this._authConfig = config;
    } else {
      const config = await this.httpClient
        .get<AuthConfig>(
          "https://localhost:5000/api/mobileappsettings/getAuthConfig",
          {
            headers: { "x-api-key": "hrmobilekey" },
          }
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
          "https://humanrisks-core-api.azurewebsites.net/api/mobileappsettings/getOrgConfig/hr",
          {
            headers: { "x-api-key": "hrmobilekey" },
          }
        )
        .toPromise();
      this._orgConfig = config;
    } else {
      const config = await this.httpClient
        .get<OrgConfig>(
          "https://localhost:5000/api/mobileappsettings/getOrgConfig/hr",
          {
            headers: { "x-api-key": "hrmobilekey" },
          }
        )
        .toPromise();
      this._orgConfig = config;
    }
  }

  public async setConfigFromOrgName(orgName: string) {
    if (environment.production) {
      const config = await this.httpClient
        .get<OrgConfig>(
          `https://humanrisks-core-api.azurewebsites.net/api/mobileappsettings/getOrgConfig/${orgName}`,
          {
            headers: { "x-api-key": "hrmobilekey" },
          }
        )
        .toPromise();
      this._orgConfig = config;
    } else {
      const config = await this.httpClient
        .get<OrgConfig>(
          `https://localhost:5000/api/mobileappsettings/getOrgConfig/${orgName}`,
          {
            headers: { "x-api-key": "hrmobilekey" },
          }
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
