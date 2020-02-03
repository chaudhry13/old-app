import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncidentReport } from 'src/app/_models/incident-report';
import { IncidentReportService } from 'src/app/_services/incident-report.service';
import { StorageService } from 'src/app/_services/storage.service';
import { Attachment } from 'src/app/_models/file';
import { ToastService } from 'src/app/_services/toast.service';
import { CameraService } from 'src/app/_services/photo.service';
import { AppConfigService } from 'src/app/_services/auth-config.service';
import { FileTransferObject, FileTransfer } from '@ionic-native/file-transfer/ngx';
import { User } from 'src/app/_models/user';
import { AlertController } from '@ionic/angular';
import { AgmMap, AgmMarker } from '@agm/core';

@Component({
  selector: 'app-incident-report-details',
  templateUrl: './incident-report-details.page.html',
  styleUrls: ['./incident-report-details.page.scss'],
})
export class IncidentReportDetailsPage implements OnInit {

  @ViewChild('map') myMap: AgmMap;

  private id: string;
  private source: any;

  public incidentReport: IncidentReport;
  public files: Attachment[];

  public photos: any = [];

  uploadProgress: number = 0;
  uploadAlert: HTMLIonAlertElement;

  user: User;

  renderMap: boolean;

  constructor(public activatedRoute: ActivatedRoute,
    public incidentReportService: IncidentReportService,
    private storageService: StorageService,
    private toastService: ToastService,
    private cameraService: CameraService,
    private appConfigService: AppConfigService,
    public fileTransfer: FileTransfer,
    private alertCtrl: AlertController) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.source = this.activatedRoute.snapshot.paramMap.get('source');
  }

  ngOnInit() {
    this.renderMap = false;
    this.incidentReportService.get(this.id, this.source).then(incidentReport => {
      this.incidentReport = incidentReport;

      if (incidentReport.source == 0) {
        this.listFiles();
      }
    });
  }

  ionViewDidEnter() {
    this.renderMap = true;
  }

  takePicture() {
    if (this.photos.length === 50) {
      this.toastService.show("You cannot add more than 50 photos");
    } else {
      this.cameraService.camera().then(image => {
        var uri = encodeURI(
          this.appConfigService.apiBaseUrl + "/api/storage" +
          "/incident-report?incidentReportId=" + this.incidentReport.id
        );

        const fileTransfer: FileTransferObject = this.fileTransfer.create();
        const options = this.cameraService.options(image);
        options.chunkedMode = false;
        options.params = {};

        this.progress();

        fileTransfer
          .upload(image, uri, options)
          .then(result => {
            this.toastService.show("Photo was uploaded successfully");

            this.uploadAlert.dismiss();
            this.listFiles();
          })
          .catch(error => {
            this.toastService.show("An error occurred uploading the image");
            this.uploadAlert.dismiss();
          });

        fileTransfer.onProgress(progress => {
          this.uploadProgress = (progress.loaded / progress.total) * 100;
          var percent = Math.round(this.uploadProgress);
          this.uploadAlert.subHeader = (percent.toString() + "% uploaded");
        });
      }).then(result => {
        console.log(result);
      }).catch(error => {
        console.debug(error);
      });
    }
  }

  async listFiles() {
    this.storageService.listIncidentReport(this.incidentReport.id).then(files => {
      this.files = files;
    });
  }

  progress() {
    this.alertCtrl.create({
      header: "Uploading..",
      subHeader: this.uploadProgress.toString()
    }).then(alert => {
      this.uploadAlert = alert;
      this.uploadAlert.present();
    });
  }

  async removePicture(file: Attachment) {
    const confirm = await this.deleteConfirmationAlert();
    if (confirm) {
      this.storageService.deleteIncidentReport(this.incidentReport.id, file.name).then(() => {
        this.listFiles();
      });
    }
  }

  async deleteConfirmationAlert(): Promise<boolean> {
    let resolver: (confirm: boolean) => void;
    const promise = new Promise<boolean>(resolve => {
      resolver = resolve;
    });
    const alert = await this.alertCtrl.create({
      header: 'Warning!',
      message: "Are you sure you want to delete this file?",
      buttons: [
        {
          text: 'Delete',
          handler: () => resolver(true)
        },
        {
          text: 'Cancel',
          handler: () => resolver(false)
        }
      ]
    });
    await alert.present();
    return promise;
  }

}
