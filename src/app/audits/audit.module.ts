import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuditPage } from "./audit.page";
import { DivisionSelectorComponent } from '../_shared/division-selector/division-selector.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild([{ path: "", component: AuditPage }])],
  declarations: [AuditPage, DivisionSelectorComponent]
})
export class AuditPageModule { }
