import { HttpClient } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { Router } from "@angular/router";
import { AuthConfig } from "@app/interfaces/auth-config";
import { AppConfigService } from "@app/services/app-config.service";
import { Platform } from "@ionic/angular";
import {
  AuthModule,
  EventTypes,
  LogLevel,
  OpenIdConfiguration,
  PublicEventsService,
  StsConfigHttpLoader,
  StsConfigLoader,
} from "angular-auth-oidc-client";

export const httpLoaderFactory = (
  config: AppConfigService,
  platform: Platform
) => {
  const res = config.loadAuthConfig().then(() => {
    const c = config.authConfig;
    return <OpenIdConfiguration>{
      authority: c.authServer,
      redirectUrl:
        !platform.is("android") && !platform.is("ios")
          ? window.location.origin
          : "com.humanrisks://login",
      postLogoutRedirectUri:
        !platform.is("android") && !platform.is("ios")
          ? window.location.origin
          : "com.humanrisks://logout",
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
    };
  });

  return new StsConfigHttpLoader(res);
};

@NgModule({
  imports: [
    AuthModule.forRoot({
      loader: {
        provide: StsConfigLoader,
        useFactory: httpLoaderFactory,
        deps: [AppConfigService, Platform],
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}
