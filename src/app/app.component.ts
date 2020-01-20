import { Component, isDevMode } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { OAuthService, NullValidationHandler, OAuthErrorEvent, JwksValidationHandler, AuthConfig } from "angular-oauth2-oidc";
import { authConfigDefault } from "./_settings/auth.config";
import { Router } from "@angular/router";
import { Storage } from '@ionic/storage';

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private oauthService: OAuthService,
    private router: Router,
    private storage: Storage
  ) {
    this.initialize();
  }

  initialize() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      console.log("App.component: initialize");

      this.configureImplicitFlowAuthentication();
    });
  }

  configureImplicitFlowAuthentication() {
    console.log("App.component: implicitFlowAuth");

    var authConfig = new AuthConfig();

    this.storage.get("client_id").then(ci => {
      authConfig.clientId = ci;
    });
    this.storage.get("iss").then(i => {
      authConfig.issuer = i;
    });
    this.storage.get("scope").then(s => {
      authConfig.scope = s;
    });
    this.storage.get("logout_url").then(l => {
      authConfig.logoutUrl = l;
    });
    this.storage.get("redirect_uri").then(r => {
      authConfig.redirectUri = r;
    });
    this.storage.get("oidc").then(o => {
      authConfig.oidc = o;
    });

    console.debug("The issuer: " + authConfig.issuer);

    if (authConfig.issuer) {
      this.oauthService.configure(authConfig);
    } else {
      this.oauthService.configure(authConfigDefault);
    }


    this.oauthService.setStorage(localStorage);

    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocument();

    this.oauthService.events.subscribe(e => (e instanceof OAuthErrorEvent ? console.error(e) : console.warn(e)));
  }
}
