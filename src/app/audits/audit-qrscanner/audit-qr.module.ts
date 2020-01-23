import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuditQrPage } from './audit-qr.page';

const routes: Routes = [{
  path: '',
  component: AuditQrPage
}]

@NgModule({
  imports: [CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)],
  exports: [],
  declarations: [AuditQrPage],
})
export class AuditQrPageModule { }