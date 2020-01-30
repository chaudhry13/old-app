import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AuditDetailsPage } from './audit-details.page';
import { SanitizeHtmlPipe } from 'src/app/_settings/sanitazion.pipe';
import { ApplicationPipesModule } from 'src/app/_settings/application-pipes.module';

const routes: Routes = [
  {
    path: '',
    component: AuditDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ApplicationPipesModule
  ],
  declarations: [AuditDetailsPage]
})
export class AuditDetailsPageModule { }
