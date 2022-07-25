import { AuthConfig, OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { AppConfigService } from "@app/services/app-config.service";
import rs from 'jsrsasign';
import { AuthService } from './auth.service';
import { APP_INITIALIZER, NgModule, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from "@awesome-cordova-plugins/splash-screen/ngx";
import { StatusBar } from '@capacitor/status-bar';
import { App } from '@capacitor/app';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';


const authConfigFactory = (responseType: 'CODE' | 'IMPLICIT', config: AppConfigService): AuthConfig => {
  if (responseType === 'CODE') {
    return {
      issuer: config.authConfig.authServer,
      logoutUrl: config.authConfig.logoutUrl,
      redirectUri: window.location.origin,
      clientId: config.authConfig.clientId,
      customQueryParams: {
        audience: config.authConfig.apiAudience,
      },
      scope: `openid offline_access email ${config.authConfig.apiAudience}`,
      showDebugInformation: true,
      responseType: 'code',
      strictDiscoveryDocumentValidation: false,
      openUri: (uri: string) => {
        console.log("openUri", uri);
        Browser.open({ url: uri, windowName: "_self" })
      },
    };
  } else if (responseType === 'IMPLICIT') {
    return {
      issuer: config.authConfig.authServer,
      logoutUrl: config.authConfig.logoutUrl,
      redirectUri: window.location.origin,
      silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
      clientId: config.authConfig.clientId,
      customQueryParams: {
        audience: config.authConfig.apiAudience,
      },
      scope: `openid email ${config.authConfig.apiAudience}`,
      showDebugInformation: true,
    };
  } else throw new Error('Unexpected response type!');
};

const createJWKFromPem = (pem: string, kid: string = null): any => {
  var jwk = rs.KEYUTIL.getJWK(pem, true);
  if (kid) jwk.kid = kid;

  const jwks = {
    keys: [jwk],
  };

  return jwks;
};

const loadFactory = (config: AppConfigService,platform: Platform, splashScreen: SplashScreen, zone: NgZone, auth: AuthService, router: Router) => () => {
  return config.loadAuthConfig().then(async () => {
    const responseType: 'CODE' | 'IMPLICIT' = config.authConfig.authFlow;
    const authConfig: AuthConfig = authConfigFactory(responseType, config);

    // if not using discovery, then we need to manbually set some params
    if(!config.authConfig.useDiscovery) {
      if(!config.authConfig.loginUrl) throw new Error('LoginUrl is required, when not using discovery!');
      if(!config.authConfig.pubKeyUrl) throw new Error('Public key url is required, when not using discovery!');
      if(!config.authConfig.tokenUrl && responseType === 'CODE') throw new Error('TokenUrl is required with CODE FLOW, when not using discovery!');

      authConfig.loginUrl = config.authConfig.loginUrl;
      authConfig.revocationEndpoint = config.authConfig.revocationUrl;
      authConfig.tokenEndpoint = config.authConfig.tokenUrl;

      const pem = await config.loadPublicKey();
      if (pem) {
        const jwks = createJWKFromPem(pem, config.authConfig.kid);
        authConfig.jwks = jwks;
      }
      else throw new Error('Failed to load public key!');
    }

    auth.configure(authConfig);
    if(config.authConfig.useDiscovery) await auth.loadDiscoveryDocument();
    auth.registerEvents();
    if (config.authConfig.silentRefresh) auth.initAutomaticSilentRefresh();
    if (responseType === 'IMPLICIT') auth.setValidationHandler();
    
    return initialize(platform, splashScreen, zone, auth, router);
  });
};

const initialize = (platform: Platform, splashScreen: SplashScreen, zone: NgZone, auth: AuthService, router: Router) => {
  return platform.ready().then((x) => {

    splashScreen.hide();

    if (platform.is("android"))
      StatusBar.setOverlaysWebView({ overlay: false });

    App.addListener("appUrlOpen", ({ url }) => {
      // Must run inside an NgZone for Angular to pick up the changes
      // https://capacitorjs.com/docs/guides/angular
      console.log("opened", url);
      zone.run(() => {
        if (url?.startsWith("com.humanrisks://login")) {
          if (
            url.includes("state=") &&
            (url.includes("error=") || url.includes("code="))
          ) {

            auth
              .initLogin()
              .then(x => {
                console.log(x);
                router.navigate(["/tabs/tab1"]);
                if (platform.is("ios")) Browser.close();
              }
                 
              );
          } else {
            if (platform.is("ios")) Browser.close();
          }
        } else if (url?.startsWith("com.humanrisks://logout")) {
          // Call handleRedirectCallback and close the browser
          auth.logout().then((x) => {
            console.log("checkauth after logut", x);
            router.navigate(["/home"]);
            if (platform.is("ios")) Browser.close();
          });
        }
      });
    });
    return x;
  });
}

@NgModule({
  imports: [OAuthModule.forRoot()],
  exports: [OAuthModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService, AuthService, Platform, SplashScreen, NgZone, Router],
      useFactory: loadFactory,
    },
  ],
})
export class AuthModule {}
