import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { ProfilePage } from "./pages/profile.page";
import { SharedModule } from "@shared/shared.module";
import { UserService } from "@app/services/user.service";
import { DivisionService } from "@app/services/division.service";

const routes: Routes = [
  {
    path: "",
    component: ProfilePage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [ProfilePage],
})
export class ProfilePageModule {}
