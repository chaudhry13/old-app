import { HttpClient } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { AuthConfig } from "@app/interfaces/auth-config";
import { AppConfigService } from "@app/services/app-config.service";
import {
  AuthModule,
  LogLevel,
  StsConfigHttpLoader,
  StsConfigLoader,
} from "angular-auth-oidc-client";
import { from, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";

export const httpLoaderFactory = (config: AppConfigService) => {
  const config$ = from(config.loadAuthConfig()).pipe(
    switchMap(() =>
      from(config.getCached<AuthConfig>("authConfig")).pipe(
        map((c) => ({
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
        }))
      )
    )
  );
  return new StsConfigHttpLoader(config$);
};

@NgModule({
  imports: [
    AuthModule.forRoot({
      loader: {
        provide: StsConfigLoader,
        useFactory: httpLoaderFactory,
        deps: [AppConfigService],
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}
