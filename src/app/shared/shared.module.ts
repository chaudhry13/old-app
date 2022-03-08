import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DivisionItemComponent } from "./components/division-item/division-item.component";
import { DivisionListComponent } from "./components/division-list/division-list.component";
import { DivisionSelectorComponent } from "./components/division-selector/division-selector.component";
import { DivisionSelectorModalPage } from "./components/division-selector-modal/division-selector-modal.page";
import { ErrorMessageComponent } from "./components/error-message/error-message.component";
import { LocationModalPage } from "./components/location-modal/location-modal.page";
import { LocationSearchbarComponent } from "./components/location-searchbar/location-searchbar.component";
import { RiskLevelPipe } from "@shared/pipes/risk-level.pipe";
import { SanitizeHtmlPipe } from "@shared/pipes/sanitazion.pipe";
import { CameraService } from "@app/services/photo.service";
import { ToastService } from "@app/services/toast.service";
import { DivisionService } from "@app/services/division.service";
import { CountryService } from "@app/services/country.service";
import { LocationService } from "@app/services/location.service";
import { GeocodingService } from "@app/services/geocoding.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { ValidationService } from "../features/audits/services/validation.service";
import { QRScanner } from "@ionic-native/qr-scanner/ngx";
import { DeeplinkService } from "@app/services/deeplink.service";
import { IncidentReportService } from "@app/services/incident-report.service";
import { IonicModule } from "@ionic/angular";
import { PlacesSearchService } from "../core/services/places-search.service";
import { LocationFormComponent } from "@shared/components/location-form/location-form.component";
import { UploadPhotoButtonComponent } from "@shared/components/upload-photo-button/upload-photo-button.component";
import { PhotoListComponent } from "@shared/components/photo-list/photo-list.component";

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
    SanitizeHtmlPipe,
    LocationFormComponent,
    UploadPhotoButtonComponent,
    PhotoListComponent,
  ],
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
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
    SanitizeHtmlPipe,
    LocationFormComponent,
    UploadPhotoButtonComponent,
    PhotoListComponent,
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
    IncidentReportService,
    PlacesSearchService,
  ],
})
export class SharedModule {}
