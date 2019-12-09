import { NgModule } from '@angular/core';

import { AuditCompletePage } from './audit-complete.page'
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: '',
  component: AuditCompletePage
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
    ReactiveFormsModule],
  exports: [],
  declarations: [AuditCompletePage],
})

export class AuditCompletePageModule { }
