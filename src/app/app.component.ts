import { Component, isDevMode } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { OAuthService, NullValidationHandler, OAuthErrorEvent, JwksValidationHandler } from "angular-oauth2-oidc";
import { authConfig, authConfigLocal } from "./_settings/auth.config";
import { Router } from "@angular/router";

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
		private router: Router
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
		if (isDevMode) {
			this.oauthService.configure(authConfigLocal);
		} else {
			this.oauthService.configure(authConfig);
		}
		
		this.oauthService.setStorage(localStorage);

		this.oauthService.tokenValidationHandler = new JwksValidationHandler();
		this.oauthService.loadDiscoveryDocument();

		this.oauthService.events.subscribe(e => (e instanceof OAuthErrorEvent ? console.error(e) : console.warn(e)));
	}
}
