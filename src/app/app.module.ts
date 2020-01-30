import { NgModule, APP_INITIALIZER } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Camera } from '@ionic-native/camera/ngx';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { CallbackComponent } from "./_account/callback.component";
import { AuthGuard } from "./_guards/auth.guard";
import { TokenService } from "./_services/token.service";

import { OAuthModule } from "angular-oauth2-oidc";
import { LoginComponent } from "./login/login.component";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { Device } from "@ionic-native/device/ngx";
import { ControlService } from "./_services/control.service";
import { FormBuilder, FormsModule } from "@angular/forms";
import { TokenInterceptor } from "./_interceptors/auth.interceptor";
import { DivisionService } from "./_services/division.service";
import { StorageService } from "./_services/storage.service";
import { AuditService } from "./_services/audit.service";
import { UserService } from "./_services/user.service";
import { NotificationService } from "./_services/notification.service";
import { IncidentReportService } from "./_services/incident-report.service";
import { CountryService } from './_services/country.service';
import { IncidentCategoryService } from './_services/incident-category.service';

import { File } from '@ionic-native/File/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';

import { AgmCoreModule } from '@agm/core';
import { LocationModalPage } from './modals/location-modal.page';
import { GeocodingService } from './_services/geocoding.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ToastService } from './_services/toast.service';
import { MapService } from './_services/maps.service';
import { CameraService } from './_services/photo.service';
import { AccountService } from './_services/account.service';
import { SettingsService } from './_services/settings.service';

import { IonicStorageModule } from '@ionic/storage';
import { AppConfigService } from './_services/auth-config.service';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SanitizeHtmlPipe } from './_settings/sanitazion.pipe';
import { ApplicationPipesModule } from './_settings/application-pipes.module';

@NgModule({
  declarations: [AppComponent, CallbackComponent, LoginComponent, LocationModalPage],
  entryComponents: [CallbackComponent, LoginComponent, LocationModalPage],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ["https://test1api.humanrisks.com/"],
        sendAccessToken: true
      }
    }),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ApplicationPipesModule
  ],
  providers: [
    AccountService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        return () => {
          // Make sure to return a promise!
          return appConfigService.loadAppConfig();
        };
      }
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
    FormBuilder,
    TokenService,
    ControlService,
    DivisionService,
    StorageService,
    SettingsService,
    CountryService,
    AuditService,
    GeocodingService,
    Geolocation,
    ToastService,
    MapService,
    CameraService,
    Camera,
    IncidentCategoryService,
    UserService,
    IncidentReportService,
    NotificationService,
    QRScanner,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
