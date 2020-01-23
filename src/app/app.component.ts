import { Component, isDevMode } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { OAuthService, NullValidationHandler, OAuthErrorEvent, JwksValidationHandler, AuthConfig } from "angular-oauth2-oidc";
import { AppConfig } from "./_settings/auth.config";
import { Router } from "@angular/router";
import { AppConfigService } from './_services/auth-config.service';

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
    private appConfigService: AppConfigService
  ) {
    this.initialize();
  }

  initialize() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.appConfigService.loadAppConfig();
      console.log("App.component: initialize");

      this.configureImplicitFlowAuthentication();
    });
  }

  configureImplicitFlowAuthentication() {
    console.log("App.component: implicitFlowAuth");
    console.log("used in auth config -> clientId: " + this.appConfigService.appConfig.clientId);
    console.log("used in auth config -> issuer: " + this.appConfigService.appConfig.issuer);
    console.log("used in auth config -> scope: " + this.appConfigService.appConfig.scope);
    console.log("used in auth config -> logoutUrl: " + this.appConfigService.appConfig.logoutUrl);
    console.log("used in auth config -> redirectUri: " + this.appConfigService.appConfig.redirectUri);
    console.log("used in auth config -> oidc: " + this.appConfigService.appConfig.oidc);
    this.oauthService.configure(this.appConfigService.appConfig);

    console.log("oauth now configured!");

    if (this.oauthService.hasValidAccessToken()) {

    }

    this.oauthService.setStorage(localStorage);

    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocument();

    this.oauthService.events.subscribe(e => (e instanceof OAuthErrorEvent ? console.error(e) : console.warn(e)));

  }
}
