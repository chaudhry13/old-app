import { NgModule, APP_INITIALIZER } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

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

@NgModule({
	declarations: [AppComponent, CallbackComponent, LoginComponent, LocationModalPage],
	entryComponents: [CallbackComponent, LoginComponent, LocationModalPage],
	imports: [
		BrowserModule,
		HttpClientModule,
		IonicModule.forRoot(),
		OAuthModule.forRoot({
			resourceServer: {
				allowedUrls: ["https://humanrisks-core-api.azurewebsites.net/"],
				sendAccessToken: true
			}
		}),
		AppRoutingModule,
		FormsModule
	],
	providers: [
		File,
		FileOpener,
		FileTransfer,
		DocumentViewer,
		AuthGuard,
		StatusBar,
		SplashScreen,
		InAppBrowser,
		Device,
		FormBuilder,
		TokenService,
		ControlService,
		DivisionService,
		StorageService,
		CountryService,
		AuditService,
		GeocodingService,
		Geolocation,
		IncidentCategoryService,
		UserService,
		IncidentReportService,
		NotificationService,
		{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
