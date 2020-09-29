import { ValidationService } from "@app/services/validation.service";
import { QuestionnaireHelperService } from "@app/services/questionnaire-helper.service";
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
import { CallbackComponent } from "@app/authentication/callback/callback.component";
import { AuthGuard } from "@app/guards/auth.guard";
import { TokenService } from "@app/services/token.service";

import { OAuthModule } from "angular-oauth2-oidc";
import { LoginComponent } from "@app/authentication/login/login.component";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { Device } from "@ionic-native/device/ngx";
import { ControlService } from "./features/audits/services/control.service";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TokenInterceptor } from "@app/interceptors/auth.interceptor";
import { DivisionService } from "@app/services/division.service";
import { StorageService } from "@app/services/storage.service";
import { UserService } from "@app/services/user.service";
import { IncidentReportService } from "@app/services/incident-report.service";
import { CountryService } from "@app/services/country.service";
import { IncidentCategoryService } from "@app/services/incident-category.service";

import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { FileTransfer } from "@ionic-native/file-transfer/ngx";
import { DocumentViewer } from "@ionic-native/document-viewer/ngx";

import { AgmCoreModule } from "@agm/core";
import { GeocodingService } from "@app/services/geocoding.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { ToastService } from "@app/services/toast.service";
import { MapService } from "@app/services/maps.service";
import { CameraService } from "@app/services/photo.service";
import { AccountService } from "@app/services/account.service";
import { SettingsService } from "@app/services/settings.service";

import { IonicStorageModule } from "@ionic/storage";
import { AppConfigService } from "@app/services/auth-config.service";
import { Keyboard } from "@ionic-native/keyboard/ngx";
import { QRScanner } from "@ionic-native/qr-scanner/ngx";
import { DeeplinkService } from "@app/services/deeplink.service";
import { FollowUpService } from "@app/services/follow-up.service";

import { QuestionnaireService, QuestionAnsweredService, QuestionnaireUserAnswerService } from "@app/services/questionnaire.service";
import { PlacesSearchService } from "@app/services/places-search.service";
import { LocationService } from "@app/services/location.service";

@NgModule({
  declarations: [
    AppComponent,
    CallbackComponent,
    LoginComponent],
  entryComponents: [CallbackComponent, LoginComponent],
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
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAXqcs7go3XxPZarCGTcSJxm_OU7ClN3Q0",
      libraries: ["places"]
    })
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
    DeeplinkService,
    AuthGuard,
    StatusBar,
    SplashScreen,
    InAppBrowser,
    Device,
    Keyboard,
    Camera,
    FormBuilder,
    TokenService,
    FollowUpService,
    ControlService,
    DivisionService,
    StorageService,
    SettingsService,
    CountryService,
    GeocodingService,
    Geolocation,
    ToastService,
    MapService,
    CameraService,
    IncidentCategoryService,
    UserService,
    IncidentReportService,
    QuestionAnsweredService,
    QuestionnaireUserAnswerService,
    QRScanner,
    QuestionnaireService,
    QuestionnaireHelperService,
    ValidationService,
    PlacesSearchService,
    LocationService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
