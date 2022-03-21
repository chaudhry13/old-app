import { Component, NgZone } from "@angular/core";
import { NavController, Platform } from "@ionic/angular";
import { SplashScreen } from "@awesome-cordova-plugins/splash-screen/ngx";
import { EMPTY, Subject } from "rxjs";
import { AuthService } from "./auth/auth.service";
import { mergeMap, takeUntil, tap } from "rxjs/operators";
import { Deeplinks } from "@awesome-cordova-plugins/deeplinks/ngx";
import { Router } from "@angular/router";
import { App, URLOpenListenerEvent } from "@capacitor/app";
import { ToastService } from "@app/services/toast.service";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Browser } from "@capacitor/browser";

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
    private toast: ToastService
  ) {
    this.initialize();
    this.auth.error$.subscribe((x) => console.log("auth error", x));
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }

  initialize() {
    this.platform.ready().then(() => {
      console.log("ready stedi");
      this.splashScreen.hide();

      this.auth.initializeAuth().subscribe();

      App.addListener("appUrlOpen", ({ url }) => {
        // Must run inside an NgZone for Angular to pick up the changes
        // https://capacitorjs.com/docs/guides/angular
        console.log("opened", url);
        this.zone.run(() => {
          if (url?.startsWith("com.humanrisks://login")) {
            if (
              url.includes("state=") &&
              (url.includes("error=") || url.includes("code="))
            ) {
              // Call handleRedirectCallback and close the browser
              this.auth
                .initializeAuth(url)
                .pipe(
                  tap(() => {
                    this.router.navigate(["/tabs/tab1"]);
                    if (this.platform.is("ios")) Browser.close();
                  })
                )
                .subscribe();
            } else {
              if (this.platform.is("ios")) Browser.close();
            }
          } else if (url?.startsWith("com.humanrisks://logout")) {
            // Call handleRedirectCallback and close the browser
            this.auth
              .initializeAuth(url)
              .pipe(
                tap(() => {
                  this.router.navigate(["/home"]);
                  if (this.platform.is("ios")) Browser.close();
                })
              )
              .subscribe();
          }
        });
      });

      // // For IOS
      // if (this.platform.is("ios")) {
      //   App.addListener("appUrlOpen", (event: URLOpenListenerEvent) => {
      //     this.zone.run(() => {
      //       console.log(event.url);
      //       if (event.url.includes("code")) {
      //         this.initAuth(event.url).subscribe(() => {
      //           this.router.navigate(["/tabs/tab1"]);
      //         });
      //       } else if (event.url) {
      //         this.router.navigate(["/home"]);
      //       } else {
      //         this.toast.show("Failed to authenticate", "danger");
      //       }
      //     });
      //   });
      // } else if (this.platform.is("android")) {
      //   // For android
      //   StatusBar.setOverlaysWebView({ overlay: false });
      //   this.deeplinks.routeWithNavController(this.navController, {}).subscribe(
      //     (match) =>
      //       this.navController
      //         .navigateForward(match.$link.path + "?" + match.$link.queryString)
      //         .then(() => {
      //           console.log(JSON.stringify(match));

      //           if (
      //             (match.$link.path + "?" + match.$link.queryString).includes(
      //               "code"
      //             )
      //           ) {
      //             this.initAuth().subscribe(() => {
      //               this.router.navigate(["/tabs/tab1"]);
      //             });
      //           } else {
      //             this.router.navigate(["/home"]);
      //           }
      //         }),
      //     (nomatch) => {
      //       this.toast.show("Failed to authenticate", "danger");
      //       console.error(
      //         "Got a deeplink that didn't match",
      //         JSON.stringify(nomatch)
      //       );
      //     }
      //   );
      // }
      // this.initAuth().subscribe();
    });
  }

  // private initAuth(url: string = null) {
  //   return this.auth.initializeAuth(url);
  // }
}
