import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "",
    component: TabsPage,
    children: [
      {
        path: "tab1",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("src/app/features/audits/audit.module").then(
                (m) => m.AuditModule
              ),
          },
        ],
      },
      {
        path: "tab2",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "src/app/features/incident-reports/incident-report.module"
              ).then((m) => m.IncidentReportPageModule),
          },
        ],
      },
      {
        path: "tab3",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("src/app/features/notifications/notification.module").then(
                (m) => m.NotificationPageModule
              ),
          },
        ],
      },
      {
        path: "tab4",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("src/app/features/profile/profile.module").then(
                (m) => m.ProfilePageModule
              ),
          },
        ],
      },
      { path: "", redirectTo: "tabs/tab1", pathMatch: "full" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
