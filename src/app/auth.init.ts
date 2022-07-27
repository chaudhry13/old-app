import { AuthConfig, OAuthModule } from 'angular-oauth2-oidc';
import { AppConfigService } from "@app/services/app-config.service";
import rs from 'jsrsasign';
import { AuthService } from './auth/auth.service';
import { NgModule, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from "@awesome-cordova-plugins/splash-screen/ngx";
import { StatusBar } from '@capacitor/status-bar';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';

export const configureAuth = async (config: AppConfigService,platform: Platform, splashScreen: SplashScreen, zone: NgZone, auth: AuthService, router: Router)  => {
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
};

export const initAuthListeners = async (platform: Platform,auth: AuthService) => {
 
  if (platform.is("ios") || platform.is("android")) {
    App.addListener("appUrlOpen", ({ url }) => {
      auth.initLogin().then(() => {
        Browser.close();
      })
      //zone.run(() => {});
    });
  }
  else {
    auth.initLogin();
  }
}

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