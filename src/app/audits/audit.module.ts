import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuditPage } from "./audit.page";
import { HumanrisksComponentsModule } from '../_shared/humanrisks-components/humanrisks-components.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild([{ path: "", component: AuditPage }]), HumanrisksComponentsModule],
  declarations: [AuditPage]
})
export class AuditPageModule { }
