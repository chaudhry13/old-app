import { Component, OnInit } from "@angular/core";
import { NotificationService } from "../_services/notification.service";
import { Notification } from "../_models/notification";

@Component({
  selector: "app-notification-page",
  templateUrl: "notification.page.html",
  styleUrls: ["notification.page.scss"]
})
export class NotificationPage implements OnInit {
  notifications: Notification[];

  unreadNotifications: Notification[];
  readNotifications: Notification[];

  read: boolean = false;

  constructor(public notificationService: NotificationService) { }

  ngOnInit() {
    this.listNotifications();

    this.notifications = this.unreadNotifications;
  }

  listNotifications() {
    this.notificationService.list(false).then(unreadNotifications => {
      this.unreadNotifications = unreadNotifications;

      this.notifications = unreadNotifications;
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
    console.log("read notification");
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
    }, 2000);
  }
}
