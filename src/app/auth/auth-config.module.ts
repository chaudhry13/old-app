import { NgModule } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';


@NgModule({
    imports: [AuthModule.forRoot({
        config: {
            authority: config.appConfig.AuthServer,
            redirectUrl: window.location.origin,
            postLogoutRedirectUri: window.location.origin,
            clientId: '',
            scope: `openid offline_access email ${config.appConfig.ApiAudience}`, // offline access for refresh tokens
            responseType: "code",
            silentRenew: true, // automatically renew access tokens before expiration
            useRefreshToken: true, // use refresh token for silent renew isntead of iframe
            customParamsAuthRequest: {
              audience: config.appConfig.ApiAudience,
            },
            customParamsRefreshTokenRequest: {
              scope: `openid offline_access email ${config.appConfig.ApiAudience}`,
            },
            logLevel: LogLevel.None,
          }
      })],
    exports: [AuthModule],
})
export class AuthConfigModule {}
