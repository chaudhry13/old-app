import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuditPage } from "./audit.page";
import { AuditDetailsPage } from './audit-details/audit-details.page';
import { DivisionSelectorComponent } from '../_shared/division-selector/division-selector.component';
import { DivisionItemComponent } from '../_shared/division-item/division-item.component';
import { DivisionListComponent } from '../_shared/division-list/division-list.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild([{ path: "", component: AuditPage }])],
  declarations: [AuditPage, DivisionSelectorComponent, DivisionItemComponent, DivisionListComponent]
})
export class AuditPageModule { }
