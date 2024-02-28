import { Injectable } from "@angular/core";
import { User } from "@app/models/user";
import { AppConfigService } from "@app/services/app-config.service";
import { UserService } from "@app/services/user.service";
import { OAuth2AuthenticateOptions, OAuth2Client } from "@byteowls/capacitor-oauth2";
import { BehaviorSubject, combineLatest } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { decodeJwt } from "jose";

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
    try {
      const token = await this.getAccessToken();

      if (!token) {
        this.isDoneLoading.next(true);
        this.isAuthenticated.next(false);

        return;
      }

      const shouldRefreshToken = this.isTokenAboutToExpire(token);

      if (shouldRefreshToken) {
        this.isDoneLoading.next(true);
        this.isAuthenticated.next(false);

        return;
      }

      await this.getUser();

      this.isAuthenticated.next(true);
    } catch (e) {
      console.error("Error initializing login", e);
      this.logout();
    } finally {
      this.isDoneLoading.next(true);
    }
  }

  async logout() {
    await SecureStoragePlugin.remove({
      key: "tokens",
    });

    this.isAuthenticated.next(false);
  }

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

    await SecureStoragePlugin.set({
      key: "tokens",
      value: JSON.stringify({ id_token, access_token, refresh_token }),
    });

    await this.getUser();

    this.isAuthenticated.next(true);
  }

  async getOrRefreshAccessToken() {
    const token = await this.getAccessToken();

    if (!token || this.isTokenAboutToExpire(token)) {
      await this.refreshTokens();
    }

    const access_token = await this.getAccessToken();

    if (!access_token) return null;

    return access_token;
  }

  private async getAccessToken(): Promise<string | null> {
    const tokensRes = await SecureStoragePlugin.get({
      key: "tokens",
    });

    if(!tokensRes.value) return null;

    const tokens = JSON.parse(tokensRes.value);

    const token = tokens.access_token;

    if (!token) return null;

    return token;
  }

  private async refreshTokens() {
    const tokensRes = await SecureStoragePlugin.get({
        key: "tokens",
        });
    
    if(!tokensRes.value) throw new Error("No tokens found, so couldn't refresh");

    const tokens = JSON.parse(tokensRes.value);

    const token = tokens.refresh_token;

    if (!token) throw new Error("No refresh token provided");

    const oidcConfig = this.getAuthConfig();
    console.log("oidcConfig", oidcConfig);

    const authRes = await OAuth2Client.refreshToken({
      accessTokenEndpoint: oidcConfig.accessTokenEndpoint,
      appId: oidcConfig.appId,
      refreshToken: token,
      scope: oidcConfig.scope,
    });

    console.log("refresh token res", authRes);

    const { id_token, access_token, refresh_token } = authRes;

    if (!id_token || !access_token || !refresh_token) {
      console.error("Invalid token response");
      return;
    }

    await SecureStoragePlugin.set({
      key: "tokens",
      value: JSON.stringify({ id_token, access_token, refresh_token }),
    });
  }

  private async getUser() {
    const userInfo = await this.userService.getUserInfo().toPromise();
    this._user = userInfo;
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
        redirectUrl: "http://localhost:8100",
      },
    };
  }

  private isTokenAboutToExpire(accessToken) {
    const decodedToken = decodeJwt(accessToken);
    const expirationTimeInSeconds = decodedToken.exp;
    const currentTimeInSeconds = Math.floor(Date.now() / 1000); // Current time in seconds

    const bufferInSeconds = 60 * 5;
    const timeUntilExpiration = expirationTimeInSeconds - currentTimeInSeconds;

    console.log("timeUntilExpiration", timeUntilExpiration);

    return timeUntilExpiration <= bufferInSeconds;
  }
}
