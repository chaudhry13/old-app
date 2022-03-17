import { Component } from "@angular/core";
import { NavController, Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AppConfigService } from "./core/services/app-config.service";
import { Subject } from "rxjs";
import { AuthService } from "./auth/auth.service";
import { takeUntil } from "rxjs/operators";
import { Deeplinks } from "@awesome-cordova-plugins/deeplinks/ngx";
import { Router } from "@angular/router";

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
    private deeplinks: Deeplinks,
    public navController: NavController,
    private router: Router,
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
      
      this.deeplinks
        .routeWithNavController(this.navController, {})
        .pipe(takeUntil(this.unsub$))
        .subscribe(
          (match) =>
            this.navController
              .navigateForward(match.$link.path + "?" + match.$link.queryString)
              .then(() => {
                this.initAuth().subscribe(() => {
                  this.router.navigate(["/tabs/tab1"]);
                });
              }),
          (nomatch) =>
            console.error(
              "Got a deeplink that didn't match",
              JSON.stringify(nomatch)
            )
        );

      this.initAuth().subscribe();
    });
  }

  private initAuth() {
    return this.auth.initializeAuth().pipe(takeUntil(this.unsub$));
    //this.auth.loginCallback().pipe(takeUntil(this.unsub$)).subscribe();
    //this.auth.error$.subscribe((x) => console.log(x));
  }
}
