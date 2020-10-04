import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NotificationPage } from "./pages/notification-page/notification.page";
import { NotificationService } from "./services/notification.service";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: "", component: NotificationPage }]),
    SharedModule,
  ],
  declarations: [NotificationPage],
  providers: [NotificationService],
})
export class NotificationPageModule {}
