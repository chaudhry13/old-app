import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable()
export class ToastService {
  constructor(private toastCtrl: ToastController) {}

  show(message: string, level: string = "success") {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      color: level,
    });

    toast.then((toast) => toast.present());
  }

  showWithDuration(message: string, duration: number) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
    });

    toast.then((toast) => toast.present());
  }
}
