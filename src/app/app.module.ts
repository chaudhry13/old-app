import { NgModule, APP_INITIALIZER, NgZone } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { Router, RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy, Platform } from "@ionic/angular";
import { SplashScreen } from "@awesome-cordova-plugins/splash-screen/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthGuard } from "@app/guards/auth.guard";

import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { Device } from "@ionic-native/device/ngx";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TokenInterceptor } from "@app/interceptors/auth.interceptor";

import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { DocumentViewer } from "@ionic-native/document-viewer/ngx";

import { AgmCoreModule } from "@agm/core";
import { AccountService } from "@app/services/account.service";

import { IonicStorageModule } from "@ionic/storage";
import { AppConfigService } from "@app/services/app-config.service";
import { Keyboard } from "@ionic-native/keyboard/ngx";
import { UserService } from "@app/services/user.service";
import { StorageService } from "@app/services/storage.service";
import { FileTransfer } from "@awesome-cordova-plugins/file-transfer/ngx";
import { HomeComponent } from "./home/home.component";
import { SharedModule } from "@shared/shared.module";
import { OrgConfig } from "@app/interfaces/org-config";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { AuthModule, loadFactory } from "./auth/auth.module";
import { AuthService } from "./auth/auth.service";

@NgModule({
  declarations: [AppComponent, HomeComponent, ErrorPageComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot(),
    SharedModule,
    AuthModule
  ],
  providers: [
    AccountService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService, AuthService, Platform, SplashScreen, NgZone, Router],
      useFactory: (appConfigService: AppConfigService,auth: AuthService, platform: Platform,  splash: SplashScreen, zone: NgZone, router: Router) => {
        const outerPromise = new Promise<void>((resolve, reject) => {
          // In order to load the google script with dynamic API key, we need to first load config, then attach script to body.
          // script.onload/onerror is necessary, otherwise there is a timeing error, even though it should be syncronous
          appConfigService.getCached<OrgConfig>("orgConfig").then(async (x) => {
            console.log("load org config", x);
            
            if (x) {
              appConfigService.orgConfig = x;
              console.log("auth",auth)
              await loadFactory(appConfigService,platform, splash, zone, auth, router)();
              const script = document.createElement("script");
              script.src = `https://maps.googleapis.com/maps/api/js?key=${x.googleApiKey}&libraries=places,visualization`;
              script.async = true;
              script.defer = true;
              document.body.appendChild(script);
              script.onload = () => resolve();
              script.onerror = () => resolve();
            } else {
              resolve();
            }
          });
        });

        return () => outerPromise;
      },
    },
    File,
    FileOpener,
    FileTransfer,
    DocumentViewer,
    AuthGuard,
    SplashScreen,
    InAppBrowser,
    Device,
    Keyboard,
    UserService,
    StorageService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
