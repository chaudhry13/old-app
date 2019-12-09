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
//import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
import { TokenService } from 'src/app/_services/token.service';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { Attachment } from 'src/app/_models/file';
import { Alert } from 'selenium-webdriver';

@Component({
  selector: "app-audit-complete",
  templateUrl: "audit-complete.page.html"
})
export class AuditCompletePage implements OnInit {
  @ViewChild("map") mapRef: ElementRef;

  @Input()
  id: string;

  audit: Audit = new Audit();

  auditForm: FormGroup;

  photo: string;
  photos: any = [];

  uploadProgress: number = 0;
  uploadAlert: HTMLIonAlertElement;

  user: User;

  // id: string;
  // controlId: string;
  // title: string;
  // description: string;
  // date: string;
  // remarks?: string;
  // other?: string;
  // followUp: boolean;
  // followUpId: string;
  // late: boolean;
  // completed: boolean;
  // completedAt: Date;
  // location: boolean;
  // latitude: number;
  // longitude: number;
  // files: Attachment[];

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
    //public fileTransfer: FileTransfer,
    public accountService: AccountService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.getAudit();

    this.auditForm = this.formBuilder.group({
      id: ["", Validators.required],
      description: ["", Validators.required],
      other: [""],
      nearMiss: [false],
      divisionIds: [null, Validators.required],
      address: [""],
      city: [""],
      startDate: [new Date().toISOString(), Validators.required],
      endDate: [new Date().toISOString(), Validators.required],
      latitude: ["", Validators.required],
      longitude: ["", Validators.required],
      incidentTypeId: [null, Validators.required],
      incidentCategoryId: [null, Validators.required],
      countryId: [""]
    });
  }

  ngOnInit() {
    this.accountService.get().then(user => {
      this.user = user;
    })
  }

  getAudit() {
    this.auditService.get(this.id).then(
      data => {
        this.audit = data;

        // this.showMap();
      },
      error => {
        this.toastService.show("An error occurred retrieving the audit..");
      }
    );
  }


  // takePicture() {
  //   if (this.photos.length === 50) {
  //     this.toastService.show("You cannot add more than 50 photos");
  //   } else {
  //     this.cameraService.camera().then(image => {
  //       var uri = encodeURI(
  //         "https://humanrisks-core-api.azurewebsites.net/api" +
  //         "/audit?organizationId=" + this.user.organization + "&controlId=" + this.audit.controlId + "&auditId=" + this.audit.id
  //       );

  //       const fileTransfer: FileTransferObject = this.fileTransfer;
  //       const options = this.cameraService.options(image);

  //       this.progress();

  //       fileTransfer
  //         .upload(image, uri, options)
  //         .then(result => {
  //           let file: Attachment = JSON.parse(result.response);

  //           file.name = options.fileName;

  //           this.audit.files.push(file);
  //           this.photos.reverse();

  //           this.toastService.show("Photo was uploaded successfully");

  //           this.uploadAlert.dismiss();
  //         })
  //         .catch(error => {
  //           this.toastService.show("An error occurred uploading the image");
  //         });

  //       fileTransfer.onProgress(progress => {
  //         this.uploadProgress = (progress.loaded / progress.total) * 100;

  //         var percent = Math.round(this.uploadProgress);

  //         this.uploadAlert.subHeader = (percent.toString() + "% uploaded");
  //       });
  //     });
  //   }
  // }

  progress() {
    this.alertCtrl.create({
      header: "Uploading..",
      subHeader: this.uploadProgress.toString()
    }).then(alert => {
      this.uploadAlert = alert;
    });

    this.uploadAlert.present();
  }

  showMap() {
    this.mapService.init(
      this.audit.latitude,
      this.audit.longitude,
      this.mapRef,
      true
    );
  }
}
