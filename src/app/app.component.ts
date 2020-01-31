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
      this.statusBar.styleLightContent()
      this.splashScreen.hide();
      this.appConfigService.loadAppConfig();

      this.configureImplicitFlowAuthentication();
    });
  }

  configureImplicitFlowAuthentication() {
    this.oauthService.configure(this.appConfigService.appConfig);

    if (this.oauthService.hasValidAccessToken()) {

    }

    this.oauthService.setStorage(localStorage);

    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocument();

    this.oauthService.events.subscribe(e => (e instanceof OAuthErrorEvent ? console.error(e) : console.warn(e)));

  }
}
