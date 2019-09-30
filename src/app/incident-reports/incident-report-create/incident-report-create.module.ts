import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgmCoreModule } from '@agm/core';
import { IncidentReportCreatePage } from './incident-report-create.page';

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
  declarations: [IncidentReportCreatePage],
})
export class IncidentReportCreatePageModule { }