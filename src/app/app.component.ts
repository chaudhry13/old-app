import { Component, NgZone } from "@angular/core";
import { NavController, Platform } from "@ionic/angular";
import { SplashScreen } from "@awesome-cordova-plugins/splash-screen/ngx";
import { Subject } from "rxjs";
import { AuthService } from "./auth/auth.service";
import { takeUntil } from "rxjs/operators";
import { Deeplinks } from "@awesome-cordova-plugins/deeplinks/ngx";
import { Router } from "@angular/router";
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { ToastService } from "@app/services/toast.service";
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
})
export class AppComponent {
  private unsub$ = new Subject<void>();

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
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
      
      this.splashScreen.hide();

      // For IOS
      if (this.platform.is('ios')) {
        App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
          this.zone.run(() => {
              console.log(event.url);
              if (event.url.includes('code')) {
                this.initAuth(event.url).subscribe(() => {
                  this.router.navigate(["/tabs/tab1"]);
                });
              }
              else if (event.url) {
                this.router.navigate(['/home']);
              }
              else {
                this.toast.show('Failed to authenticate', 'danger');
              }
            });
        });
      }
      else {
      // For android
      StatusBar.setOverlaysWebView({ overlay: false });
      this.deeplinks
        .routeWithNavController(this.navController, {})
        .subscribe(
          (match) =>
            this.navController
              .navigateForward(match.$link.path + "?" + match.$link.queryString)
              .then(() => {
                if (match.$link.includes('code')) {
                  this.initAuth().subscribe(() => {
                    this.router.navigate(["/tabs/tab1"]);
                  });
                }
                else {
                  this.router.navigate(['/home']);
                }
              }),
          (nomatch) => {
            this.toast.show('Failed to authenticate', 'danger');
            console.error(
              "Got a deeplink that didn't match",
              JSON.stringify(nomatch)
              )
            }
          );
      }
      this.initAuth().subscribe();
    });
  }

  private initAuth(url: string = null) {
    return this.auth.initializeAuth(url).pipe(takeUntil(this.unsub$));
  }
}
