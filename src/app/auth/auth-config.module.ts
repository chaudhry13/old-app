import { HttpClient } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { Router } from "@angular/router";
import { AuthConfig } from "@app/interfaces/auth-config";
import { AppConfigService } from "@app/services/app-config.service";
import {
  AuthModule,
  EventTypes,
  LogLevel,
  OpenIdConfiguration,
  PublicEventsService,
  StsConfigHttpLoader,
  StsConfigLoader,
} from "angular-auth-oidc-client";
import { EMPTY, from, of } from "rxjs";
import { catchError, filter, map, switchMap, tap } from "rxjs/operators";

export const httpLoaderFactory = (config: AppConfigService, router: Router) => {
  const res = config.loadAuthConfig().then((c) => ({
    authority: c.authServer,
    redirectUrl: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    clientId: c.clientId,
    scope: `openid offline_access email ${c.apiAudience}`, // offline access for refresh tokens
    responseType: "code",
    silentRenew: true, // automatically renew access tokens before expiration
    useRefreshToken: true, // use refresh token for silent renew isntead of iframe
    customParamsAuthRequest: {
      audience: c.apiAudience,
    },
    customParamsRefreshTokenRequest: {
      scope: `openid offline_access email ${c.apiAudience}`,
    },
    logLevel: LogLevel.None,
  }));

  return new StsConfigHttpLoader(res);
};

@NgModule({
  imports: [
    AuthModule.forRoot({
      loader: {
        provide: StsConfigLoader,
        useFactory: httpLoaderFactory,
        deps: [AppConfigService, Router],
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}
