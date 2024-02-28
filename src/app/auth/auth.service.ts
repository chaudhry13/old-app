import { Injectable } from "@angular/core";
import { User } from "@app/models/user";
import { AppConfigService } from "@app/services/app-config.service";
import { UserService } from "@app/services/user.service";
import { OAuth2AuthenticateOptions, OAuth2Client } from "@byteowls/capacitor-oauth2";
import { BehaviorSubject, combineLatest } from "rxjs";
import { filter, map, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private _user: User = null;
  private readonly isDoneLoading = new BehaviorSubject(false);
  private readonly isAuthenticated = new BehaviorSubject(false);

  public get user() {
    return this._user;
  }

  public isDoneLoading$ = this.isDoneLoading.asObservable();
  public isAuthenticated$ = this.isAuthenticated.asObservable();

  public canLoadInGuard$ = combineLatest([this.isAuthenticated$, this.isDoneLoading$]).pipe(
    filter(([isAuthenticated, isDoneLoading]) => isDoneLoading),
    map(([isAuthenticated, isDoneLoading]) => ({ isAuthenticated, isDoneLoading }))
  );

  constructor(private userService: UserService, private config: AppConfigService) {}

  async initLogin() {
    // check for token and set initial state
    this.getUserIfAuthenticated()
      .catch(() => {
        this.logout();
      })
      .finally(() => this.isDoneLoading.next(true));
  }

  async initLoginV2() {
    this.isDoneLoading.next(true);
  }

  async logout() {}

  async login() {
    const oidcConfig = this.getAuthConfig();
    console.log("oidcConfig", oidcConfig);
    // Auth0 specific, specify organization login screen
    const auth0OrgId = this.config.orgConfig.auth0OrgId;
    if (auth0OrgId) {
      oidcConfig.additionalParameters = { organization: auth0OrgId };
    }

    const authRes = await OAuth2Client.authenticate(oidcConfig);

    const { id_token, access_token, refresh_token } = authRes["access_token_response"];

    if (!id_token || !access_token || !refresh_token) {
      console.error("Invalid token response");
      return;
    }

    console.log("id_token", id_token);
    console.log("access_token", access_token);
    console.log("refresh_token", refresh_token);
  }

  getAccessToken() {
    // get access token, if expired then handle it
    return "lmao";
  }

  private async getUserIfAuthenticated() {
    const isAuthenticated = true;
    //this.auth.hasValidIdToken();
    console.log("isAuthenticated", isAuthenticated);

    if (isAuthenticated) {
      const userInfo = await this.userService.getUserInfo().toPromise();
      this._user = userInfo;
    }
    this.isAuthenticated.next(isAuthenticated);
  }

  private getAuthConfig(): OAuth2AuthenticateOptions {
    const config = this.config.orgConfig;

    return {
      accessTokenEndpoint: config.tokenUrl,
      appId: config.clientId,
      authorizationBaseUrl: `${config.authServer}/authorize`,
      logsEnabled: true,
      pkceEnabled: true,
      responseType: "code",
      scope: "openid email profile offline_access",
      android: {
        redirectUrl: config.pubkeyUrl,
      },
      web: {
        redirectUrl: config.pubkeyUrl,
      },
    };
  }
}
