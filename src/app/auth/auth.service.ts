import { Injectable } from "@angular/core";
import { OrgConfig } from "@app/interfaces/org-config";
import { User } from "@app/models/user";
import { AppConfigService } from "@app/services/app-config.service";
import { UserService } from "@app/services/user.service";
import { LoginResponse, OidcSecurityService } from "angular-auth-oidc-client";
import { stringify } from "querystring";
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  forkJoin,
  from,
  NEVER,
  Observable,
  of,
  throwError,
} from "rxjs";
import { catchError, filter, map, switchMap, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private _user: User = null;
  private readonly error = new BehaviorSubject<any>(false);
  private readonly isLoading = new BehaviorSubject(true);

  /**
   * Authenticated user with claims
   */
  public get user() {
    return this._user;
  }

  /** Loading observable which emits false when the login is
   * successfully completed. Initial value: true.
   */
  public error$ = this.error.asObservable();

  /** Loading observable which emits false when the login is
   * successfully completed. Initial value: true.
   */
  public isLoading$ = this.isLoading.asObservable();

  /**
   * Observable which emits true if the user is authenticated. This observable
   * relies on the isLoading$ observable, which means it will only emit its first value,
   * once the authentication has successfully completed. This is neccessary in Auth guards,
   * when all the routes have guards combined with auto login. This will prevent timing issue,
   * infinite loop redirects.
   */
  public isAuthenticated$ = combineLatest([
    this.isLoading$,
    this.auth.isAuthenticated$,
  ]).pipe(
    filter(([isLoading, _]) => !isLoading),
    map(([isLoading, { isAuthenticated }]) => ({
      isLoading,
      isAuthenticated,
    }))
  );

  constructor(
    private auth: OidcSecurityService,
    private userService: UserService,
    private config: AppConfigService
  ) {}

  getIdToken() {
    return this.auth.getIdToken();
  }

  /**
   * Authentication initialization method. Subscribe to it once in app component to start auth process,
   * call backend for user info, set authenticated user state, and push false to isLoading$. If there is
   * an error with authentication, just logout to redirect to login as there is no unprotected pages.
   * @returns Returns the OidcSecurityService.checkAuth observable.
   */
  initializeAuth(url: string = null) {
    if (url) {
      return this.auth.checkAuth(url).pipe(
        switchMap(({ isAuthenticated, idToken, accessToken }) => {
          if (isAuthenticated)
            return this.initUser().pipe(tap(() => this.isLoading.next(false)));
          this.isLoading.next(false);
          return of({ isAuthenticated, idToken, accessToken });
        }),
        catchError((err) => {
          this.error.next(err);
          return this.logout();
        })
      );
    }

    return this.auth.checkAuth().pipe(
      switchMap(({ isAuthenticated, idToken, accessToken }) => {
        if (isAuthenticated)
          return this.initUser().pipe(tap(() => this.isLoading.next(false)));
        this.isLoading.next(false);
        return of({ isAuthenticated, idToken, accessToken });
      }),
      catchError((err) => {
        this.error.next(err);
        return this.logout();
      })
    );
  }

  /**
   * Call any functions inside the login callback observable pipe to execute it once when the
   * user has logged in. In this case we want to sync the user data with the backend.
   * @returns Login callback observable
   */
  loginCallback(): Observable<boolean> {
    return this.auth.stsCallback$
      .pipe
      //switchMap(() => this.userService.updateUserOnLogin())
      ();
  }

  /**
   * Log out and revoke tokens (also refresh tokens).
   * @returns Return OidcSecurityService.logoffAndRevokeTokens() observable.
   */
  logout() {
    return this.auth.logoffAndRevokeTokens();
  }

  logoutLocal() {
    this.auth.logoffLocal();
  }

  /**
   * Initialize login flow, redirect to Identity provider.
   */
  login() {
    // Auth0 specific, specify organization login screen
    const auth0OrgId = this.config.orgConfig.auth0OrgId;
    if (auth0OrgId)
      this.auth.authorize(null, {
        customParams: {
          organization: auth0OrgId,
        },
      });
    else this.auth.authorize();
  }

  getLoginUrl() {
    const auth0OrgId = this.config.orgConfig.auth0OrgId;
    if (auth0OrgId)
      return this.auth.getAuthorizeUrl({
        organization: auth0OrgId,
      });
    else return this.auth.getAuthorizeUrl();
  }

  getLogoutUrl(idToken?: string) {
    return idToken
      ? this.auth.getEndSessionUrl({
          id_token_hint: idToken,
        })
      : this.auth.getEndSessionUrl();
  }

  revoke() {
    return forkJoin([
      this.auth.revokeAccessToken(),
      this.auth.revokeRefreshToken(),
    ]);
  }

  forceRefresh() {
    return this.auth.forceRefreshSession();
  }

  /**
   *
   * @returns Access token for authenticated user.
   */
  getAccessToken() {
    return this.auth.getAccessToken();
  }

  private initUser() {
    //console.log("init user");
    return this.userService.getUserInfo().pipe(
      tap((u) => {
        //console.log("user", u);

        this._user = u;
      })
    );
  }
}
