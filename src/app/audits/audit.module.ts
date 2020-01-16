import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuditPage } from "./audit.page";
import { AuditDetailsPage } from './audit-details/audit-details.page';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild([{ path: "", component: AuditPage }])],
  declarations: [AuditPage]
})
export class AuditPageModule { }
