import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IncidentReportPage } from "./incident-report.page";
import { IncidentReportFilterPage } from "./incident-report-filter/incident-report-filter.page";
import { HumanrisksComponentsModule } from '../_shared/humanrisks-components/humanrisks-components.module';
import { InvestigationFilterComponent } from './incident-report-filter/investigation-filter/investigation-filter.component';
import { ObservationFilterComponent } from './incident-report-filter/observation-filter/observation-filter.component';

@NgModule({
	imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild([{ path: "", component: IncidentReportPage }]), HumanrisksComponentsModule],
	declarations: [IncidentReportPage, IncidentReportFilterPage, InvestigationFilterComponent, ObservationFilterComponent],
	entryComponents: [IncidentReportFilterPage]
})
export class IncidentReportPageModule { }
