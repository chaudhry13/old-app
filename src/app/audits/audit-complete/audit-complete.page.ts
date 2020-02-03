import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { Audit } from "../../_models/audit";
import { OAuthService } from "angular-oauth2-oidc";
import { Router, ActivatedRoute } from "@angular/router";
import { LoadingController, AlertController, NavParams } from "@ionic/angular";
import { AuditService } from "src/app/_services/audit.service";
import { CameraService } from "src/app/_services/photo.service";
import { MapService } from "src/app/_services/maps.service";
import { ToastService } from "src/app/_services/toast.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ControlService } from "src/app/_services/control.service";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer/ngx";
import { TokenService } from 'src/app/_services/token.service';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { Attachment } from 'src/app/_models/file';
import { SettingsService } from 'src/app/_services/settings.service';
import { StorageService } from 'src/app/_services/storage.service';
import { AppConfigService } from 'src/app/_services/auth-config.service';

@Component({
  selector: "app-audit-complete",
  styleUrls: ["audit-complete.page.scss"],
  templateUrl: "audit-complete.page.html"
})
export class AuditCompletePage implements OnInit {
  @Input()
  id: string;

  audit: Audit = new Audit();
  files: Attachment[] = new Array();

  auditForm: FormGroup;

  photo: string;
  photos: any = [];

  uploadProgress: number = 0;
  uploadAlert: HTMLIonAlertElement;

  user: User;

  showLocation: boolean = false;

  renderMap: boolean = false;
  renderMapComplete: boolean = false;

  constructor(
    public oauthService: OAuthService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public auditService: AuditService,
    public controlService: ControlService,
    public mapService: MapService,
    public cameraService: CameraService,
    public toastService: ToastService,
    public geolocation: Geolocation,
    public fileTransfer: FileTransfer,
    public accountService: AccountService,
    public settingsService: SettingsService,
    public accoutnService: AccountService,
    public oAuthService: OAuthService,
    public storageService: StorageService,
    public appConfigService: AppConfigService,
    public tokenService: TokenService) {

    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    this.auditForm = this.formBuilder.group({
      id: ["", Validators.required],
      other: [""],
      remarks: [""],
      followUp: [false],
      latitude: ["", Validators.required],
      longitude: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.tokenService.readToken(this.oauthService.getAccessToken());
    this.user = this.tokenService.getUser();
    this.getAudit();
  }

  // When ever the view becomes active
  ionViewWillEnter() {
    this.getAudit();
  }

  // When everything is rendered
  ionViewDidEnter() {
    this.renderMap = true;
  }

  // When leaving the view
  ionViewWillLeave() {
    let listaFrames = document.getElementsByTagName("iframe");

    // Need to pause iFrame video when leaving view or sends the app to background
    for (var index = 0; index < listaFrames.length; index++) {
      let iframe = listaFrames[index].contentWindow;
      iframe.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }
  }

  getAudit() {
    this.auditService.get(this.id).then(
      data => {
        this.audit = data;
        if (this.audit.longitude && this.audit.latitude) {
          this.showLocation = true;
        }
        this.listFiles()
        this.controlService.get(this.audit.controlId).then(control => {
          this.audit.description = control.description;
        });
      },
      error => {
        this.toastService.show("An error occurred retrieving the audit..");
      }
    );
  }

  completeAudit() {
    // TODO: View should bind to Form instead of this.
    this.auditForm.controls["id"].setValue(this.audit.id);
    this.auditForm.controls["other"].setValue(null);
    this.auditForm.controls["remarks"].setValue(null);
    this.auditForm.controls["followUp"].setValue(false);

    if (this.audit.followUp) {
      this.auditForm.controls["other"].setValue(this.audit.other);
      this.auditForm.controls["remarks"].setValue(this.audit.remarks);
      this.auditForm.controls["followUp"].setValue(this.audit.followUp);
    }
    if (this.audit.longitude && this.audit.latitude) {
      this.auditForm.controls["latitude"].setValue(this.audit.latitude);
      this.auditForm.controls["longitude"].setValue(this.audit.longitude);
    }

    this.auditService.complete(this.auditForm).then(
      data => {
        console.debug("CompleteAudit: Succuessfully completed the audit");
        this.router.navigate(["/tabs/tab1/details/" + this.audit.controlId]).then(() => {
          this.toastService.show("Audit completed successfully");
        });
      }).catch(
        error => {
          console.debug("CompleteAudit: An error occured!")
          console.debug(error.data);
          this.toastService.show("An error occurred updating the audit");
        }
      );
  }

  takePicture() {
    if (this.photos.length === 50) {
      this.toastService.show("You cannot add more than 50 photos");
    } else {
      this.cameraService.camera().then(image => {
        var uri = encodeURI(
          this.appConfigService.apiBaseUrl + "/api/storage" +
          "/audit?organizationId=" + this.user.organization + "&controlId=" + this.audit.controlId + "&auditId=" + this.audit.id + "&uid=" + this.user.id
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

  enableLocation() {
    if (this.audit.location) {
      this.toastService.show("Getting your location...");

      this.geolocation
        .getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        })
        .then(position => {
          this.audit.latitude = position.coords.latitude;
          this.audit.longitude = position.coords.longitude;

          this.renderMapComplete = true;

          this.toastService.show("Location found!");
        })
        .catch(error => {
          this.toastService.show("Your location could not be found!");
          this.audit.location = false;
          this.audit.latitude = undefined;
          this.audit.longitude = undefined;
        });
    } else {
      this.audit.location = false;
      this.audit.latitude = undefined;
      this.audit.longitude = undefined;
    }
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

  async listFiles() {
    this.storageService.listAudit(this.audit.controlId, this.audit.id).then(files => {
      this.files = files;
    });
  }

  async removePicture(file: Attachment) {
    const confirm = await this.deleteConfirmationAlert();
    if (confirm) {
      this.storageService.deleteAudit(this.audit.controlId, this.audit.id, file.name).then(() => {
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
