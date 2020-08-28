import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { IncidentReportDetailsPage } from './incident-report-details.page';
import { AgmMap, AgmCoreModule } from '@agm/core';
import { ApplicationPipesModule } from 'src/app/_settings/application-pipes.module';
import { LocationDetailsComponent } from './location-details/location-details.component';
import { ExternalReportDetailsComponent } from './external-report-details/external-report-details.component';
import { InternalReportDetailsComponent } from './internal-report-details/internal-report-details.component';
import { DefaultReportDetailsComponent } from './default-report-details/default-report-details.component';
import { InvestigationReportDetailsComponent } from './investigation-report-details/investigation-report-details.component';
import { IntelligenceReportDetailsComponent } from './intelligence-report-details/intelligence-report-details.component';

const routes: Routes = [
  {
    path: '',
    component: IncidentReportDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAXqcs7go3XxPZarCGTcSJxm_OU7ClN3Q0",
      libraries: ["places"]
    }),
    RouterModule.forChild(routes),
    ApplicationPipesModule
  ],
  declarations: [IncidentReportDetailsPage, LocationDetailsComponent, ExternalReportDetailsComponent, InternalReportDetailsComponent, DefaultReportDetailsComponent, InvestigationReportDetailsComponent, IntelligenceReportDetailsComponent]
})
export class IncidentReportDetailsPageModule { }
