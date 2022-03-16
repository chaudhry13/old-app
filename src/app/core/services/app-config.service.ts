import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { environment } from "src/environments/environment";
import { OrgConfig } from "@app/interfaces/org-config";
import { AuthConfig } from "@app/interfaces/auth-config";
import { GenericService } from "./generic.service";
import { Router } from "@angular/router";

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
  private _orgConfig: OrgConfig;
  public get orgConfig() {
    return this._orgConfig;
  }
  public set orgConfig(val: OrgConfig) {
    this._orgConfig = val;
  }

  // private _authConfig: AuthConfig;
  // public get authConfig() {
  //   return this._authConfig;
  // }

  constructor(
    private storage: Storage,
    private httpClient: HttpClient,
    private router: Router
  ) {}

  public loadAuthConfig() {
    const authConfigCached = this.getCached<AuthConfig>("authConfig");
    if (authConfigCached) return authConfigCached;

    if (environment.production) {
      const res = this.httpClient
        .get<AuthConfig>(
          "https://humanrisks-core-api.azurewebsites.net/api/mobileappsettings/getAuthConfig",
          {
            headers: { "x-api-key": "hrmobilekey" },
          }
        )
        .toPromise();
      res.then((x) => this.setCache("authConfig", x));

      return res;
    } else {
      const res = this.httpClient
        .get<AuthConfig>(
          "https://localhost:5000/api/mobileappsettings/getAuthConfig",
          {
            headers: { "x-api-key": "hrmobilekey" },
          }
        )
        .toPromise();
      res.then((x) => this.setCache("authConfig", x));
      return res;
    }
  }

  public async setConfigFromOrgName(orgName: string) {
    if (environment.production) {
      const orgConfig = await this.httpClient
        .get<OrgConfig>(
          `https://humanrisks-core-api.azurewebsites.net/api/mobileappsettings/getOrgConfig/${orgName}`,
          {
            headers: { "x-api-key": "hrmobilekey" },
          }
        )
        .toPromise();

      await this.setCache("orgConfig", orgConfig);
    } else {
      const orgConfig = await this.httpClient
        .get<OrgConfig>(
          `https://localhost:5000/api/mobileappsettings/getOrgConfig/${orgName}`,
          {
            headers: { "x-api-key": "hrmobilekey" },
          }
        )
        .toPromise();

      await this.setCache("orgConfig", orgConfig);
    }
  }

  public async getCached<T>(key: string): Promise<T> {
    return await this.storage.get(key);
  }

  public async setCache(key: string, val: any) {
    await this.storage.set(key, val);
  }

  public async clearCache(key: string) {
    await this.storage.remove(key);
  }
}
