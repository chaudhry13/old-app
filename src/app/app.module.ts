import { NgModule, APP_INITIALIZER } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Camera } from "@ionic-native/camera/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthGuard } from "@app/guards/auth.guard";

import { OAuthModule } from "angular-oauth2-oidc";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { Device } from "@ionic-native/device/ngx";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TokenInterceptor } from "@app/interceptors/auth.interceptor";

import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { DocumentViewer } from "@ionic-native/document-viewer/ngx";

import { AgmCoreModule } from "@agm/core";
import { AccountService } from "@app/services/account.service";

import { IonicStorageModule, Storage } from "@ionic/storage";
import { AppConfigService } from "@app/services/app-config.service";
import { Keyboard } from "@ionic-native/keyboard/ngx";
import { UserService } from "@app/services/user.service";
import { StorageService } from "@app/services/storage.service";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from "@awesome-cordova-plugins/file-transfer/ngx";
import { HomeComponent } from "./home/home.component";
import { SharedModule } from "@shared/shared.module";
import { AuthConfigModule } from "./auth/auth-config.module";

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [
          "https://test1api.humanrisks.com/",
          "https://humanrisks-core-api.azurewebsites.net",
          "https://app1api.humanrisks.com",
          "https://localhost:5000",
        ],
        sendAccessToken: true,
      },
    }),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot(),
    SharedModule,
    AuthConfigModule,
  ],
  providers: [
    AccountService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        return () => {
          return appConfigService.loadConfig();
        };
      },
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        const outerPromise = new Promise<void>((resolve, reject) => {
          // In order to load the google script with dynamic API key, we need to first load config, then attach script to body.
          // script.onload/onerror is necessary, otherwise there is a timeing error, even though it should be syncronous
          appConfigService.loadConfig().then(() => {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${appConfigService.orgConfig.googleApiKey}&libraries=places,visualization`;
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
            script.onload = () => resolve();
            script.onerror = () => resolve();
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
    StatusBar,
    SplashScreen,
    InAppBrowser,
    Device,
    Keyboard,
    Camera,
    UserService,
    StorageService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
