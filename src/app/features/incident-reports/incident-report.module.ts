import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IncidentReportPage } from "./pages/incident-report-page/incident-report.page";
import { IncidentReportFilterPage } from "./pages/incident-report-filters/incident-report-filter.page";
import { InvestigationFilterComponent } from "./components/incident-report-filter/investigation-filter/investigation-filter.component";
import { ObservationFilterComponent } from "./components/incident-report-filter/observation-filter/observation-filter.component";
import { SharedModule } from "@shared/shared.module";
import { IncidentReportRoutingModule } from "./incident-report-routing.module";
import { IncidentReportDetailsPage } from "./pages/incident-report-details/incident-report-details.page";
import { LocationDetailsComponent } from "./components/incident-report-details/location-details/location-details.component";
import { ExternalReportDetailsComponent } from "./components/incident-report-details/external-report-details/external-report-details.component";
import { InternalReportDetailsComponent } from "./components/incident-report-details/internal-report-details/internal-report-details.component";
import { DefaultReportDetailsComponent } from "./components/incident-report-details/default-report-details/default-report-details.component";
import { InvestigationReportDetailsComponent } from "./components/incident-report-details/investigation-report-details/investigation-report-details.component";
import { IntelligenceReportDetailsComponent } from "./components/incident-report-details/intelligence-report-details/intelligence-report-details.component";
import { IncidentReportPhotosComponent } from "./components/incident-report-details/incident-report-photos/incident-report-photos.component";
import { TakePhotoButtonComponent } from "./components/incident-report-details/take-photo-button/take-photo-button.component";
import { AgmCoreModule } from "@agm/core";
import { IncidentReportCreatePage } from "./pages/incident-report-create/incident-report-create.page";
import { DefaultReportFormComponent } from "./components/incident-report-forms/default-report-form/default-report-form.component";
import { InvestigationReportFormComponent } from "./components/incident-report-forms/investigation-report-form/investigation-report-form.component";
import { PersonsFormComponent } from "./components/incident-report-forms/persons-form/persons-form.component";
import { IntelligenceReportFormComponent } from "./components/incident-report-forms/intelligence-report-form/intelligence-report-form.component";
import { VehicleFormComponent } from "./components/incident-report-forms/vehicle-form/vehicle-form.component";
import { HealthSafetyService } from "./services/health-safety.service";
import { IncidentCategoryService } from "./services/incident-category.service";
import { IncidentReportService } from "@app/services/incident-report.service";
import { ActivityLogService } from "../activity-log/services/activity-log-service";
import {FormBuilderModule} from "../form-builder/form-builder.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IncidentReportRoutingModule,
    SharedModule,
    AgmCoreModule,
    FormBuilderModule
  ],
  declarations: [
    IncidentReportPage,
    IncidentReportFilterPage,
    InvestigationFilterComponent,
    ObservationFilterComponent,
    IncidentReportDetailsPage,
    LocationDetailsComponent,
    ExternalReportDetailsComponent,
    InternalReportDetailsComponent,
    DefaultReportDetailsComponent,
    InvestigationReportDetailsComponent,
    IntelligenceReportDetailsComponent,
    IncidentReportPhotosComponent,
    TakePhotoButtonComponent,
    IncidentReportCreatePage,
    DefaultReportFormComponent,
    InvestigationReportFormComponent,
    PersonsFormComponent,
    IntelligenceReportFormComponent,
    VehicleFormComponent,
  ],
  providers: [
    HealthSafetyService,
    IncidentCategoryService,
    IncidentReportService,
    ActivityLogService,
  ],
  exports: [TakePhotoButtonComponent],
})
export class IncidentReportPageModule {}
