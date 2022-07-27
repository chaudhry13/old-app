import { NgModule, APP_INITIALIZER, NgZone } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { Router, RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy, Platform } from "@ionic/angular";

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
import { configureAuth, initAuthListeners } from "./auth.init";
import { AuthService } from "./auth/auth.service";
import { StatusBar } from "@capacitor/status-bar";
import { OAuthModule } from "angular-oauth2-oidc";
import { beforeAppInit } from "./app.init";

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
    OAuthModule.forRoot(),
  ],
  providers: [
    AccountService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService, AuthService, Platform, NgZone, Router],
      useFactory: beforeAppInit
    },
    File,
    FileOpener,
    FileTransfer,
    DocumentViewer,
    AuthGuard,
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
