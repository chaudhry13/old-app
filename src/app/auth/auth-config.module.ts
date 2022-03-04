import { NgModule } from "@angular/core";
import { AuthModule, LogLevel } from "angular-auth-oidc-client";
import config from "../../assets/appsettings.json";

@NgModule({
  imports: [
    AuthModule.forRoot({
      config: {
        authority: config.AuthServer,
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: config.ClientId,
        scope: `openid offline_access email ${config.ApiAudience}`, // offline access for refresh tokens
        responseType: "code",
        silentRenew: true, // automatically renew access tokens before expiration
        useRefreshToken: true, // use refresh token for silent renew isntead of iframe
        customParamsAuthRequest: {
          audience: config.ApiAudience,
        },
        customParamsRefreshTokenRequest: {
          scope: `openid offline_access email ${config.ApiAudience}`,
        },
        logLevel: LogLevel.None,
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}
