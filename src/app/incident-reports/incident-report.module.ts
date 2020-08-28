import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IncidentReportPage } from "./incident-report.page";
import { IncidentReportFilterPage } from "./incident-report-filter/incident-report-filter.page";
import { HumanrisksComponentsModule } from '../_shared/humanrisks-components/humanrisks-components.module';

@NgModule({
	imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild([{ path: "", component: IncidentReportPage }]), HumanrisksComponentsModule],
	declarations: [IncidentReportPage, IncidentReportFilterPage],
	entryComponents: [IncidentReportFilterPage]
})
export class IncidentReportPageModule { }
