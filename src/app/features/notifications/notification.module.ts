import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NotificationPage } from "./pages/notification-page/notification.page";

@NgModule({
	imports: [IonicModule, CommonModule, FormsModule, RouterModule.forChild([{ path: "", component: NotificationPage }])],
	declarations: [NotificationPage]
})
export class NotificationPageModule {}
