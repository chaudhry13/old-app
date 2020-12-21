import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ActivityLogPageRoutingModule } from "./activity-log-routing.module";

import { ActivityCreationPage } from "./pages/activity-creation/activity-creation-page.component";
import { SharedModule } from "@shared/shared.module";
import { ActivityLogService } from "./services/activity-log-service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ActivityLogPageRoutingModule,
    SharedModule
  ],
  declarations: [ActivityCreationPage],
  providers: [
    FormBuilder,
    ActivityLogService
  ]
})
export class ActivityLogPageModule {}
