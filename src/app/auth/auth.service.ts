import { Injectable } from "@angular/core";
import { User } from "@app/models/user";
import { AppConfigService } from "@app/services/app-config.service";
import { UserService } from "@app/services/user.service";
import {  AuthConfig, OAuthService } from "angular-oauth2-oidc";
import {
  BehaviorSubject,
  combineLatest,
} from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';

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

  constructor(private auth: OAuthService, private userService: UserService, private config: AppConfigService) {}

  configure(config: AuthConfig) {
    this.auth.configure(config);
  }

  initAutomaticSilentRefresh() {
    this.auth.setupAutomaticSilentRefresh();
  }

  async initLogin(customFragment?: string) {
    customFragment ? await this.auth.tryLogin({customHashFragment: customFragment}) : await this.auth.tryLogin();
    
    this.getUserIfAuthenticated()
      .catch(() => {
        this.logout();
      })
      .finally(() => this.isDoneLoading.next(true));
  }

  registerEvents() {
    this.auth.events
      .pipe(
        tap(x => {
          this.isAuthenticated.next(this.auth.hasValidIdToken());
          if (x.type === 'token_received') {
            const redirectUrl = localStorage.getItem('redirect_after_auth_url');
            if (redirectUrl) {
              localStorage.removeItem('redirect_after_auth_url');
              location.href = redirectUrl;
            }
          }
        })
      )
      .subscribe();
  }

  async logout() {
    if(!this.config.orgConfig.logoutUrl && !this.config.orgConfig.useDiscovery) return;

    if (this.config.orgConfig.useDiscovery && this.config.orgConfig.revocationUrl || (this.config.orgConfig.logoutUrl && this.config.orgConfig.revocationUrl)) {

      await this.auth.revokeTokenAndLogout(
        {
          client_id: this.auth.clientId,
          returnTo: this.auth.postLogoutRedirectUri,
        },
        true
      );
      this.isAuthenticated.next(false);
    } else if(this.config.orgConfig.useDiscovery || this.config.orgConfig.logoutUrl) {
      this.auth.logOut({
        client_id: this.auth.clientId,
        returnTo: this.auth.postLogoutRedirectUri,
      });
      this.isAuthenticated.next(false);
    }
  }

  login(redirectUrl?: string) {
    if (redirectUrl) localStorage.setItem('redirect_after_auth_url', redirectUrl);
    // Auth0 specific, specify organization login screen
    const auth0OrgId = this.config.orgConfig.auth0OrgId;
    if (auth0OrgId) this.auth.initLoginFlow(null, { organization: auth0OrgId });
    else this.auth.initLoginFlow();
  }

  setValidationHandler() {
    this.auth.tokenValidationHandler = new JwksValidationHandler();
  }

  getAccessToken() {
    return this.auth.getAccessToken();
  }

  private async getUserIfAuthenticated() {
    const isAuthenticated = this.auth.hasValidIdToken();
    console.log('isAuthenticated', isAuthenticated);

    if (isAuthenticated) {
      const userInfo = await this.userService.getUserInfo().toPromise();
      this._user = userInfo;
    }
    this.isAuthenticated.next(isAuthenticated);
  }

  loadDiscoveryDocument() {
    return this.auth.loadDiscoveryDocument();
  }

}
