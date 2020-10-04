import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IncidentReportPage } from "./pages/incident-report-page/incident-report.page";
import { IncidentReportDetailsPage } from "./pages/incident-report-details/incident-report-details.page";
import { IncidentReportCreatePage } from "./pages/incident-report-create/incident-report-create.page";

const routes: Routes = [
  {
    path: "",
    component: IncidentReportPage,
  },
  {
    path: "details/:id/:source",
    component: IncidentReportDetailsPage,
  },
  {
    path: "create",
    component: IncidentReportCreatePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncidentReportRoutingModule {}
