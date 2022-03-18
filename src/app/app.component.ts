import { Component, NgZone } from "@angular/core";
import { NavController, Platform } from "@ionic/angular";
import { SplashScreen } from "@awesome-cordova-plugins/splash-screen/ngx";
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { Subject } from "rxjs";
import { AuthService } from "./auth/auth.service";
import { takeUntil } from "rxjs/operators";
import { Deeplinks } from "@awesome-cordova-plugins/deeplinks/ngx";
import { Router } from "@angular/router";
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { ToastService } from "@app/services/toast.service";

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
    private auth: AuthService,
    private deeplinks: Deeplinks,
    public navController: NavController,
    private router: Router,
    private zone: NgZone,
    private toast: ToastService,
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

      App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        this.zone.run(() => {
            if (event.url) {
              this.gotBack(event.url);
            }
            else {
              this.toast.show('Failed to authenticate', 'danger');
            }
          });
      });
      /*
      this.deeplinks
        .routeWithNavController(this.navController, {})
        .subscribe(
          (match) => { this.gotBack() },
          (nomatch) => {
            this.toast.show('Failed to authenticate', 'danger');
            console.error(
              "Got a deeplink that didn't match",
              JSON.stringify(nomatch)
              )
            }
          );
      */
      this.initAuth().subscribe();
    });
  }

  private gotBack(url: string = null) {
    this.initAuth(url).subscribe(() => {
      this.router.navigate(["/tabs/tab1"]);
    });
  }

  private initAuth(url: string = null) {
    return this.auth.initializeAuth(url).pipe(takeUntil(this.unsub$));
  }
}
