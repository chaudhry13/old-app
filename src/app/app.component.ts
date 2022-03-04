import { Component } from "@angular/core";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AppConfigService } from "./core/services/app-config.service";
import { Subject } from "rxjs";
import { AuthService } from "./auth/auth.service";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
})
export class AppComponent {
  private unsub$ = new Subject<void>();

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private appConfigService: AppConfigService,
    private auth: AuthService
  ) {
    this.initialize();
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }

  initialize() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      // this.appConfigService.loadAppConfig().then(() => {
      //   this.appConfigService.configureImplicitFlowAuthentication();
      // });
      this.initAuth();
    });
  }

  private initAuth() {
    this.auth.initializeAuth().pipe(takeUntil(this.unsub$)).subscribe();
    //this.auth.loginCallback().pipe(takeUntil(this.unsub$)).subscribe();
  }
}
