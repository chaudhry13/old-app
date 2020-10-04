import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DivisionItemComponent} from "./components/division-item/division-item.component";
import {DivisionListComponent} from "./components/division-list/division-list.component";
import {DivisionSelectorComponent} from "./components/division-selector/division-selector.component";
import {DivisionSelectorModalPage} from "./components/division-selector-modal/division-selector-modal.page";
import {ErrorMessageComponent} from "./components/error-message/error-message.component";
import {LocationModalPage} from "./components/location-modal/location-modal.page";
import {LocationSearchbarComponent} from "./components/location-searchbar/location-searchbar.component";
import {RiskLevelPipe} from "@shared/pipes/risk-level.pipe";
import {SanitizeHtmlPipe} from "@shared/pipes/sanitazion.pipe";
import {CameraService} from "@app/services/photo.service";
import {ToastService} from "@app/services/toast.service";
import {DivisionService} from "@app/services/division.service";
import {CountryService} from "@shared/services/country.service";
import {LocationService} from "@app/services/location.service";
import {GeocodingService} from "@app/services/geocoding.service";
import {Geolocation} from "@ionic-native/geolocation/ngx";
import {UserService} from "@app/services/user.service";
import {TokenService} from "@app/services/token.service";
import {StorageService} from "@app/services/storage.service";
import {ValidationService} from "../features/audits/services/validation.service";
import {QRScanner} from "@ionic-native/qr-scanner/ngx";
import {DeeplinkService} from '@app/services/deeplink.service';
import {IncidentReportService} from '@shared/services/incident-report.service';



@NgModule({
  declarations: [
      DivisionItemComponent,
      DivisionListComponent,
      DivisionSelectorComponent,
      DivisionSelectorModalPage,
      ErrorMessageComponent,
      LocationModalPage,
      LocationSearchbarComponent,
      RiskLevelPipe,
      SanitizeHtmlPipe
  ],
  imports: [
    CommonModule
  ],
    exports: [
        CommonModule,
        FormsModule,
        DivisionItemComponent,
        DivisionListComponent,
        DivisionSelectorComponent,
        DivisionSelectorModalPage,
        ErrorMessageComponent,
        LocationModalPage,
        LocationSearchbarComponent,
        RiskLevelPipe,
        SanitizeHtmlPipe
    ],
    providers: [
        CameraService,
        ToastService,
        DivisionService,
        CountryService,
        LocationService,
        GeocodingService,
        Geolocation,
        ValidationService,
        QRScanner,
        DeeplinkService,
        IncidentReportService
    ]
})
export class SharedModule { }
