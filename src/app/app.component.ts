import { Component } from "@angular/core";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AppConfigService } from "./core/services/app-config.service";
import { Subject } from "rxjs";
import { AuthService } from "./auth/auth.service";
import { takeUntil } from "rxjs/operators";
import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
import { HomeComponent } from "./home/home.component";
import { AuditPage } from "./features/audits/pages/audit-page/audit.page";

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
    private auth: AuthService,
    private deeplinks: Deeplinks
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
      
      this.deeplinks.route({
        '': HomeComponent
      }).subscribe(match => {
        console.log('Successfully matched route', match);
      }, nomatch => {
        console.error('Got a deeplink that didn\'t match', nomatch);
      });
      
      this.initAuth();
    });
  }

  private initAuth() {
    this.auth.initializeAuth().pipe(takeUntil(this.unsub$)).subscribe();
    //this.auth.loginCallback().pipe(takeUntil(this.unsub$)).subscribe();
    //this.auth.error$.subscribe((x) => console.log(x));
  }
}
