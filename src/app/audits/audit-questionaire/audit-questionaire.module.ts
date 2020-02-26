import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AuditQuestionairePage } from './audit-questionaire.page';

const routes: Routes = [
  {
    path: '',
    component: AuditQuestionairePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AuditQuestionairePage]
})
export class AuditQuestionairePageModule {}
