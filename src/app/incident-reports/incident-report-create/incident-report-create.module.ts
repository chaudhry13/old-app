import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgmCoreModule } from '@agm/core';
import { IncidentReportCreatePage } from './incident-report-create.page';
import { DefaultReportFormComponent } from './incident-report-forms/default-report-form/default-report-form.component';
import { InvestigationReportFormComponent } from './incident-report-forms/investigation-report-form/investigation-report-form.component';
import { PersonsFormComponent } from './incident-report-forms/persons-form/persons-form.component';
import { LocationFormComponent } from './incident-report-forms/location-form/location-form.component';
import { IntelligenceReportFormComponent } from './incident-report-forms/intelligence-report-form/intelligence-report-form.component';

const routes: Routes = [{
  path: '',
  component: IncidentReportCreatePage
}]

@NgModule({
  imports: [CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAXqcs7go3XxPZarCGTcSJxm_OU7ClN3Q0",
      libraries: ["places"]
    }),
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule],
  exports: [],
  declarations: [IncidentReportCreatePage, DefaultReportFormComponent, InvestigationReportFormComponent, PersonsFormComponent, LocationFormComponent, IntelligenceReportFormComponent],
})
export class IncidentReportCreatePageModule { }