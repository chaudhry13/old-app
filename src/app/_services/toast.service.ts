import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable()
export class ToastService {
    constructor(private toastCtrl: ToastController) { }

    show(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });

        toast.then(toast => toast.present());
    }
}