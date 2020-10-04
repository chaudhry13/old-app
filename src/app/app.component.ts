import { Component } from "@angular/core";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AppConfigService } from "./core/services/auth-config.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private appConfigService: AppConfigService
  ) {
    this.initialize();
  }

  initialize() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.appConfigService.loadAppConfig().then(() => {
        this.appConfigService.configureImplicitFlowAuthentication();
      });
    });
  }
}
