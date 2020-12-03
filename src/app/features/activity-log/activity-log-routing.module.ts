import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ActivityCreationPage } from "./pages/activity-creation/activity-creation-page.component";

const routes: Routes = [
  {
    path: "",
    component: ActivityCreationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityLogPageRoutingModule {}
