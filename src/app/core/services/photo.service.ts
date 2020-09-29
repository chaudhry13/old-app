import { Injectable } from "@angular/core";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { FileUploadOptions } from "@ionic-native/file-transfer";
import { OAuthService } from "angular-oauth2-oidc";
import { ToastService } from "./toast.service";
import { AppConfigService } from "./auth-config.service";
import {
  FileTransferObject,
  FileTransfer,
} from "@ionic-native/file-transfer/ngx";
import { AlertController } from "@ionic/angular";

@Injectable()
export class CameraService {
  private cameraOptions: CameraOptions = {
    quality: 100,
    destinationType: this.cameraNative.DestinationType.FILE_URI,
    encodingType: this.cameraNative.EncodingType.JPEG,
    mediaType: this.cameraNative.MediaType.PICTURE,
  };

  uploadProgress: number = 0;
  uploadAlert: HTMLIonAlertElement;
  MAX_PHOTO_COUNT: number = 50;

  constructor(
    private cameraNative: Camera,
    private auth: OAuthService,
    private toastService: ToastService,
    private appConfigService: AppConfigService,
    public fileTransfer: FileTransfer,
    private alertCtrl: AlertController
  ) {}

  /**
   * Take a picture or video, or load one from the library.
   * @param {CameraOptions} [options] (Optional) Options that you want to pass to the camera. Encoding type, quality, etc. Platform-specific quirks are described in the [Cordova plugin docs](https://github.com/apache/cordova-plugin-camera#cameraoptions-errata-).
   * @returns {Promise<any>} Returns a Promise that resolves with Base64 encoding of the image data, or the image file URI, depending on cameraOptions, otherwise rejects with an error.
   */
  camera(option?: CameraOptions): Promise<any> {
    if (option) {
      return this.cameraNative.getPicture(option);
    }

    return this.cameraNative.getPicture(this.cameraOptions);
  }

  options(image: any) {
    var token = this.auth.getAccessToken();

    let options: FileUploadOptions = {
      fileKey: "file",
      fileName:
        Date.now().toString() + "_" + image.substr(image.lastIndexOf("/") + 1),
      mimeType: "image/jpeg",
      headers: { Authorization: "Bearer " + token },
    };

    return options;
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
        this.camera()
          .then((image) => {
            var uri = encodeURI(
              this.appConfigService.getApiBaseUrl +
                "/api/storage" +
                urlExtension
            );

            const fileTransfer: FileTransferObject = this.fileTransfer.create();
            const options = this.options(image);
            options.chunkedMode = false;
            options.params = {};

            this.progress();

            fileTransfer
              .upload(image, uri, options)
              .then((result) => {
                this.toastService.show("Photo was uploaded successfully");
                this.uploadAlert.dismiss();
                console.debug(result);
                return resolve(true);
              })
              .catch((error) => {
                this.toastService.show("An error occurred uploading the image");
                this.uploadAlert.dismiss();
                console.debug(error);
                return reject(error);
              });

            fileTransfer.onProgress((progress) => {
              this.uploadProgress = (progress.loaded / progress.total) * 100;
              var percent = Math.round(this.uploadProgress);
              if (this.uploadAlert)
                this.uploadAlert.subHeader = percent.toString() + "% uploaded";
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

  progress() {
    this.alertCtrl
      .create({
        header: "Uploading..",
        subHeader: this.uploadProgress.toString(),
      })
      .then((alert) => {
        this.uploadAlert = alert;
        this.uploadAlert.present();
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
