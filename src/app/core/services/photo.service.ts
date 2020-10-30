import { Injectable } from "@angular/core";
import { FileUploadOptions } from "@ionic-native/file-transfer";
import { OAuthService } from "angular-oauth2-oidc";
import { ToastService } from "./toast.service";
import { AppConfigService } from "./auth-config.service";
import {
  FileTransferObject,
  FileTransfer,
} from "@ionic-native/file-transfer/ngx";
import { AlertController } from "@ionic/angular";
import { Plugins, CameraResultType, CameraPhoto } from "@capacitor/core";

const { Camera } = Plugins;

@Injectable()
export class CameraService {
  uploadProgress: number = 0;
  uploadAlert: HTMLIonAlertElement;
  MAX_PHOTO_COUNT: number = 50;

  constructor(
    // private cameraNative: Camera,
    private oAuthService: OAuthService,
    private toastService: ToastService,
    private appConfigService: AppConfigService,
    public fileTransfer: FileTransfer,
    private alertCtrl: AlertController
  ) {}

  takePhoto(): Promise<CameraPhoto> {
    return Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });
  }

  getOptions(image: CameraPhoto): FileUploadOptions {
    const token = this.oAuthService.getAccessToken();

    return {
      fileKey: "file",
      fileName:
        Date.now().toString() + "_" + image.path.substr(image.path.lastIndexOf("/") + 1),
      mimeType: "image/jpeg",
      headers: { Authorization: "Bearer " + token },
    };
  }

  public takePhotoAndUpload(
    urlExtension: string,
    photoCount: number
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (photoCount === this.MAX_PHOTO_COUNT) {
        this.toastService.show("You cannot add more than 50 photos");
        return reject("You cannot add more than 50 photos");
      } else {
        this.takePhoto()
          .then((image) => {
            this.uploadPhoto(urlExtension, image).then(result => {
              return resolve(result);
            });
          })
          .then((result) => {
            console.debug(result);
          })
          .catch((error) => {
            console.debug(error);
            return reject(error);
          });
      }
    });
  }

  private uploadPhoto(urlExtension: string, image: CameraPhoto): Promise<boolean> {
    const uri = encodeURI(
        this.appConfigService.getApiBaseUrl +
        "/api/storage" +
        urlExtension
    );

    const fileTransfer: FileTransferObject = this.fileTransfer.create();
    const options = this.getOptions(image);
    options.chunkedMode = false;
    options.params = {};

    return new Promise<boolean>((resolve, reject) => {
      this.startProgressModal(fileTransfer);

      fileTransfer.upload(image.path, uri, options)
          .then((result) => {
            this.uploadAlert.dismiss().then(() => {
              this.toastService.show("Photo was uploaded successfully");
              resolve(true);
            });
          })
          .catch(() => {
            this.uploadAlert.dismiss().then(() => {
              this.toastService.show("An error occurred uploading the image");
              reject(false);
            });
          });
    });
  }

  startProgressModal(fileTransfer: FileTransferObject) {
    this.alertCtrl
      .create({
        header: "Uploading..",
        subHeader: this.uploadProgress.toString(),
      })
      .then((alert) => {
        this.uploadAlert = alert;
        this.uploadAlert.present();

        fileTransfer.onProgress((progress) => {
          this.uploadProgress = (progress.loaded / progress.total) * 100;
          var percent = Math.round(this.uploadProgress);
          if (this.uploadAlert)
            this.uploadAlert.subHeader = percent.toString() + "% uploaded";
        });
      });
  }

  async deleteConfirmationAlert(): Promise<boolean> {
    let resolver: (confirm: boolean) => void;
    const promise = new Promise<boolean>((resolve) => {
      resolver = resolve;
    });
    const alert = await this.alertCtrl.create({
      header: "Warning!",
      message: "Are you sure you want to delete this file?",
      buttons: [
        {
          text: "Delete",
          handler: () => resolver(true),
        },
        {
          text: "Cancel",
          handler: () => resolver(false),
        },
      ],
    });
    await alert.present();
    return promise;
  }
}