import { AuthConfig, OAuthModule } from 'angular-oauth2-oidc';
import { AppConfigService } from "@app/services/app-config.service";
import rs from 'jsrsasign';
import { AuthService } from './auth.service';
import { NgModule, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from "@awesome-cordova-plugins/splash-screen/ngx";
import { StatusBar } from '@capacitor/status-bar';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';


const authConfigFactory = (responseType: 'CODE' | 'IMPLICIT', config: AppConfigService): AuthConfig => {
  if (responseType === 'CODE') {
    return {
      issuer: config.orgConfig.authServer,
      logoutUrl: config.orgConfig.logoutUrl,
      redirectUri: window.location.origin,
      clientId: config.orgConfig.clientId,
      customQueryParams: {
        audience: config.orgConfig.apiAudience,
      },
      scope: `openid offline_access email ${config.orgConfig.apiAudience}`,
      showDebugInformation: true,
      responseType: 'code',
      strictDiscoveryDocumentValidation: false,
      openUri: (uri: string) => {
        Browser.open({ url: uri, windowName: "_self" })
      },
    };
  } else if (responseType === 'IMPLICIT') {
    return {
      issuer: config.orgConfig.authServer,
      logoutUrl: config.orgConfig.logoutUrl,
      redirectUri: window.location.origin,
      silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
      clientId: config.orgConfig.clientId,
      customQueryParams: {
        audience: config.orgConfig.apiAudience,
      },
      scope: `openid email ${config.orgConfig.apiAudience}`,
      showDebugInformation: true,
      openUri: (uri: string) => {
        Browser.open({ url: uri, windowName: "_self" })}
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

export const loadFactory = (config: AppConfigService,platform: Platform, splashScreen: SplashScreen, zone: NgZone, auth: AuthService, router: Router) => async () => {
    const responseType: 'CODE' | 'IMPLICIT' = config.orgConfig.authFlow;
    const authConfig: AuthConfig = authConfigFactory(responseType, config);

    // if not using discovery, then we need to manbually set some params
    if(!config.orgConfig.useDiscovery) {
      if(!config.orgConfig.loginUrl) throw new Error('LoginUrl is required, when not using discovery!');
      if(!config.orgConfig.pubKeyUrl) throw new Error('Public key url is required, when not using discovery!');
      if(!config.orgConfig.tokenUrl && responseType === 'CODE') throw new Error('TokenUrl is required with CODE FLOW, when not using discovery!');

      authConfig.loginUrl = config.orgConfig.loginUrl;
      authConfig.revocationEndpoint = config.orgConfig.revocationUrl;
      authConfig.tokenEndpoint = config.orgConfig.tokenUrl;

      const pem = await config.loadPublicKey();
      if (pem) {
        const jwks = createJWKFromPem(pem, config.orgConfig.kid);
        authConfig.jwks = jwks;
      }
      else throw new Error('Failed to load public key!');
    }

    auth.configure(authConfig);
    if(config.orgConfig.useDiscovery) await auth.loadDiscoveryDocument();
    auth.registerEvents();
    if (config.orgConfig.silentRefresh) auth.initAutomaticSilentRefresh();
    if (responseType === 'IMPLICIT') auth.setValidationHandler();
    
    initAuthListeners(platform, splashScreen, zone, auth, router);

};

const initAuthListeners = async (platform: Platform, splashScreen: SplashScreen, zone: NgZone, auth: AuthService, router: Router) => {
  const x = await platform.ready();
  splashScreen.hide();
  if (platform.is("android"))
    StatusBar.setOverlaysWebView({ overlay: false });
  if (platform.is("ios") || platform.is("android")) {
    App.addListener("appUrlOpen", ({ url }) => {
      // Must run inside an NgZone for Angular to pick up the changes
      // https://capacitorjs.com/docs/guides/angular
      console.log("opened", url);
      zone.run(() => {
        if (url?.startsWith("com.humanrisks://login")) {
          if (url.includes("state=") &&
            (url.includes("error=") || url.includes("code="))) {

            auth
              .initLogin()
              .then(x_1 => {
                // console.log(x);
                // router.navigate(["/tabs/tab1"]);
                if (platform.is("ios"))
                  Browser.close();
              }

              );
          } else {
            if (platform.is("ios"))
              Browser.close();
          }
        } else if (url?.startsWith("com.humanrisks://logout")) {
          auth.clearLocalSession();
          if (platform.is("ios"))
            Browser.close();
        }
      });
    });
  }
  else {
    auth.initLogin();
  }
}

@NgModule({
  imports: [OAuthModule.forRoot()],
  exports: [OAuthModule],
  providers: [
    // {
    //   provide: APP_INITIALIZER,
    //   multi: true,
    //   deps: [AppConfigService, AuthService, Platform, SplashScreen, NgZone, Router],
    //   useFactory: loadFactory,
    // },
  ],
})
export class AuthModule {}
