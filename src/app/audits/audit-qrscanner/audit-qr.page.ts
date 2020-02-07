import { Component, OnInit } from '@angular/core';
import { QRScannerStatus, QRScanner } from '@ionic-native/qr-scanner/ngx';
import { Router } from '@angular/router';
import { DeeplinkService } from 'src/app/_services/deeplink.service';
import { ToastService } from 'src/app/_services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-audit-qr',
  templateUrl: 'audit-qr.page.html',
  styleUrls: ['./audit-qr.page.scss']
})

export class AuditQrPage implements OnInit {

  constructor(private qrScanner: QRScanner, private router: Router, private deepLinkService: DeeplinkService, private toastService: ToastService) { }

  scanSub: Subscription;

  ngOnInit() {
    this.scanQr().then(qrLink => {
      this.deepLinkService.handleLink(qrLink).catch(() => {
        this.toastService.show("QR Code not valid!");
        this.router.navigate(["tabs/tab1", { replaceUrl: true }]);
      });
    });
  }

  ionViewDidLeave() {
    this.scanSub.unsubscribe();
    this.qrScanner.destroy();
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  async scanQr(): Promise<string> {
    let hash: string = '';
    try {
      hash = await this._startScanner();
      this.scanSub.unsubscribe();
      this.qrScanner.destroy();
    }
    catch (err) {
      throw err;
    }

    return hash;
  }

  private _startScanner(): Promise<any> {
    // Optionally request the permission early
    return this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        return new Promise((resolve, reject) => {
          if (status.authorized) {
            // camera permission was granted

            const ionArea = <HTMLElement>document.getElementsByClassName("qr-scanner-area")[0];
            // start scanning
            this.scanSub = this.qrScanner.scan().subscribe((text: string) => {

              this.qrScanner.hide(); // hide camera preview
              this.scanSub.unsubscribe(); // stop scanning

              // hack to hide the app and show the preview
              ionArea.style.display = "block";

              resolve(text);
            });

            // show camera preview
            ionArea.style.display = "none";
            this.qrScanner.show();
          } else if (status.denied) {
            // camera permission was permanently denied
            // you must use QRScanner.openSettings() method to guide the user to the settings page
            // then they can grant the permission from there
            this.qrScanner.openSettings();
            reject(new Error('MESSAGES.QRSCANNER.CHANGE_SETTINGS_ERROR'));
          } else {
            // permission was denied, but not permanently. You can ask for permission again at a later time.
            reject(new Error('MESSAGES.QRSCANNER.PERMISSION_DENIED_ERROR'));
          }
        })
      })
  }

}