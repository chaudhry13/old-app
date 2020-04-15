import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "tab1",
        children: [
          {
            path: "",
            loadChildren: "../audits/audit.module#AuditPageModule"
          },
          {
            path: 'details/:id',
            loadChildren: '../audits/audit-details/audit-details.module#AuditDetailsPageModule'
          },
          {
            path: 'complete/:id',
            loadChildren: '../audits/audit-complete/audit-complete.module#AuditCompletePageModule'
          },
          {
            path: 'qrscan',
            loadChildren: '../audits/audit-qrscanner/audit-qr.module#AuditQrPageModule'
          },
          {
            path: 'questionnaire/:id',
            loadChildren: '../audits/audit-questionnaire/audit-questionnaire.module#AuditQuestionnairePageModule'
          }
        ]
      },
      {
        path: "tab2",
        children: [
          {
            path: "",
            loadChildren: "../incident-reports/incident-report.module#IncidentReportPageModule"
          },
          {
            path: 'details/:id/:source',
            loadChildren: '../incident-reports/incident-report-details/incident-report-details.module#IncidentReportDetailsPageModule'
          }, {
            path: 'create',
            loadChildren: '../incident-reports/incident-report-create/incident-report-create.module#IncidentReportCreatePageModule'
          }
        ]
      },
      {
        path: "tab3",
        children: [
          {
            path: "",
            loadChildren: "../notifications/notification.module#NotificationPageModule"
          }
        ]
      },
      {
        path: "tab4",
        children: [
          {
            path: "",
            loadChildren: "../profile/profile.module#ProfilePageModule"
          }
        ]
      },
      {
        path: "",
        redirectTo: "/tabs/tab1",
        pathMatch: "full"
      }
    ]
  },
  {
    path: "",
    redirectTo: "/tabs/tab1",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
