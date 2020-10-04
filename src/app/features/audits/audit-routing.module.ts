import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuditQuestionnairePage } from "./pages/audit-questionnaire/audit-questionnaire.page";
import { AuditQrPage } from "./pages/audit-qrscanner/audit-qr.page";
import { AuditCompletePage } from "./pages/audit-complete/audit-complete.page";
import { AuditDetailsPage } from "./pages/audit-details/audit-details.page";
import { AuditPage } from "./pages/audit-page/audit.page";

const routes: Routes = [
  {
    path: "",
    component: AuditPage,
  },
  {
    path: "details/:id",
    component: AuditDetailsPage,
  },
  {
    path: "complete/:id",
    component: AuditCompletePage,
  },
  {
    path: "qrscan",
    component: AuditQrPage,
  },
  {
    path: "questionnaire/:id",
    component: AuditQuestionnairePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditRoutingModule {}
