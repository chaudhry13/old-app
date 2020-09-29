import { Component, OnInit } from "@angular/core";
import { NotificationService } from "../../services/notification.service";
import { Notification } from "@app/models/notification";
import { Router } from "@angular/router";
import { AuditService } from "../../../audits/services/audit.service";
import { ToastService } from "@app/services/toast.service";

@Component({
  selector: "app-notification-page",
  templateUrl: "notification.page.html",
  styleUrls: ["notification.page.scss"]
})
export class NotificationPage implements OnInit {
  notifications: Notification[];

  unreadNotifications: Notification[];
  readNotifications: Notification[];

  read = false;

  constructor(public notificationService: NotificationService, public router: Router, public toastService: ToastService) { }

  ngOnInit() {
    this.listNotifications();
  }

  listNotifications() {
    this.notificationService.list(false).then(unreadNotifications => {
      this.unreadNotifications = unreadNotifications;
      this.notifications = this.unreadNotifications;
    });

    this.notificationService.list(true).then(readNotifications => {
      this.readNotifications = readNotifications;
    });
  }

  notificationsChanged(ev: any) {
    if (ev.target.value === "unread") {
      this.read = false;
      this.notifications = this.unreadNotifications;
    }

    if (ev.target.value === "read") {
      this.read = true;
      this.notifications = this.readNotifications;
    }
  }

  readNotification(notification: Notification) {
    this.notificationService.read(notification.id).then(() => {
      this.listNotifications();
    });
  }

  readAllNotifications() {
    this.notificationService.readAll().then(() => {
      this.listNotifications();
    });
  }

  refresh(event) {
    setTimeout(() => {
      this.listNotifications();

      if (this.read) {
        this.notifications = this.readNotifications;
      } else {
        this.notifications = this.unreadNotifications;
      }

      event.target.complete();
    }, 1000);
  }

  notificationClicked(notificationId) {
    // FIXME: If we change the way we handle notifications, then this needs change.
    this.router.navigate(["tabs/tab1/complete/" + notificationId]).then().catch(error => {
      this.toastService.show("No audit found!");
    });
  }
}
