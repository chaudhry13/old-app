import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { IncidentReportDetailsPage } from './incident-report-details.page';
import { AgmMap, AgmCoreModule } from '@agm/core';

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
    RouterModule.forChild(routes)
  ],
  declarations: [IncidentReportDetailsPage]
})
export class IncidentReportDetailsPageModule { }
