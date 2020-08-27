import { QuestionnaireHelperService } from "./../../_services/questionnaire-helper.service";
import { Component, OnInit, Input } from "@angular/core";
import { Audit } from "../../_models/audit";
import { OAuthService } from "angular-oauth2-oidc";
import { Router, ActivatedRoute } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { AuditService } from "src/app/_services/audit.service";
import { CameraService } from "src/app/_services/photo.service";
import { ToastService } from "src/app/_services/toast.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ControlService } from "src/app/_services/control.service";
import {
  FileTransfer,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { TokenService } from "src/app/_services/token.service";
import { User } from "src/app/_models/user";
import { Attachment } from "src/app/_models/file";
import { StorageService } from "src/app/_services/storage.service";
import { AppConfigService } from "src/app/_services/auth-config.service";
import { FollowUpService } from "src/app/_services/follow-up.service";
import { FollowUp } from "src/app/_models/follow-up";
import { UserService } from "src/app/_services/user.service";

@Component({
  selector: "app-audit-complete",
  styleUrls: ["audit-complete.page.scss"],
  templateUrl: "audit-complete.page.html",
})
export class AuditCompletePage implements OnInit {
  @Input()
  id: string;

  audit: Audit = new Audit();
  files: Attachment[] = new Array();

  hasQuestionnaires = false;
  questionnairesIsLoading = false;

  auditForm: FormGroup;

  photo: string;
  photos: any = [];

  uploadProgress = 0;
  uploadAlert: HTMLIonAlertElement;

  user: User;
  completedUser: User = new User();

  showLocation = false;

  renderMap = false;
  renderMapComplete = false;
  followUp: FollowUp = new FollowUp();

  constructor(
    public oauthService: OAuthService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public auditService: AuditService,
    public controlService: ControlService,
    public cameraService: CameraService,
    public toastService: ToastService,
    public geolocation: Geolocation,
    public fileTransfer: FileTransfer,
    public storageService: StorageService,
    public appConfigService: AppConfigService,
    public tokenService: TokenService,
    public followUpService: FollowUpService,
    public userService: UserService,
    public qhs: QuestionnaireHelperService
  ) {
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
    const listOfIFramesInView = document.getElementsByTagName("iframe");

    // Need to pause iFrame video when leaving view or sends the app to background
    for (let index = 0; index < listOfIFramesInView.length; index++) {
      const iframe = listOfIFramesInView[index].contentWindow;
      iframe.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        "*"
      );
    }
  }

  getAudit() {
    this.auditService.get(this.id).then(
      (data) => {
        this.audit = data;
        if (this.audit.longitude && this.audit.latitude) {
          this.showLocation = true;
        }

        if (this.audit.followUpId) {
          this.audit.followUp = true;
          this.followUpService.get(this.audit.followUpId).then((followUp) => {
            this.followUp = followUp;
          });
        }

        if (this.audit.completedById) {
          this.userService.get(this.audit.completedById).subscribe((user) => {
            this.completedUser = user;
          });
        }

        this.listFiles();
        this.controlService.get(this.audit.controlId).then((control) => {
          this.audit.description = control.description;
        });

        this.getAuditQuestionnaires();
      },
      () => {
        this.toastService.show("An error occurred retrieving the audit..");
      }
    );
  }

  getAuditQuestionnaires() {
    if (this.audit.questionnaire) {
      this.hasQuestionnaires = true;

      if (
        !this.questionnairesIsLoading &&
        this.audit.questionnaireUserAnswers.length == 0
      ) {
        this.questionnairesIsLoading = true;
        this.auditService
          .generateUserAnswers(this.audit.id)
          .then((response) => {
            this.audit.questionnaireUserAnswers = response;
            this.questionnairesIsLoading = false;
          });
      }
    }
  }

  completeAudit() {
    // TODO: View should bind to Form instead of this.
    this.auditForm.controls.id.setValue(this.audit.id);
    this.auditForm.controls.other.setValue(null);
    this.auditForm.controls.remarks.setValue(null);
    this.auditForm.controls.followUp.setValue(false);

    if (this.audit.followUp) {
      this.auditForm.controls.other.setValue(this.audit.other);
      this.auditForm.controls.remarks.setValue(this.audit.remarks);
      this.auditForm.controls.followUp.setValue(this.audit.followUp);
    }
    if (this.audit.longitude && this.audit.latitude) {
      this.auditForm.controls.latitude.setValue(this.audit.latitude);
      this.auditForm.controls.longitude.setValue(this.audit.longitude);
    }
    this.auditService.canFinishAudit(this.audit.id).then((canFinish) => {
      if (canFinish) {
        this.auditService
          .complete(this.auditForm)
          .then(() => {
            this.router
              .navigate(["/tabs/tab1/details/" + this.audit.controlId])
              .then(() => {
                this.toastService.show("Audit completed successfully");
              });
          })
          .catch(() => {
            this.toastService.show("An error occurred completing the audit");
          });
      } else {
        this.toastService.showWithDuration(
          "All required questions needs answer before the audit can be completed!",
          5000
        );
      }
    });
  }

  takePicture() {
    if (this.photos.length === 50) {
      this.toastService.show("You cannot add more than 50 photos");
    } else {
      this.cameraService
        .camera()
        .then((image) => {
          const uri = encodeURI(
            this.appConfigService.getApiBaseUrl +
              "/api/storage" +
              "/audit?organizationId=" +
              this.user.organization +
              "&controlId=" +
              this.audit.controlId +
              "&auditId=" +
              this.audit.id +
              "&uid=" +
              this.user.id
          );

          const fileTransfer: FileTransferObject = this.fileTransfer.create();
          const options = this.cameraService.options(image);
          options.chunkedMode = false;
          options.params = {};

          this.progress();

          fileTransfer
            .upload(image, uri, options)
            .then(() => {
              this.toastService.show("Photo was uploaded successfully");

              this.uploadAlert.dismiss();
              this.listFiles();
            })
            .catch(() => {
              this.toastService.show("An error occurred uploading the image");
              this.uploadAlert.dismiss();
            });

          fileTransfer.onProgress((progress) => {
            this.uploadProgress = (progress.loaded / progress.total) * 100;
            const percent = Math.round(this.uploadProgress);
            this.uploadAlert.subHeader = percent.toString() + "% uploaded";
          });
        })
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
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
          maximumAge: 0,
        })
        .then((position) => {
          this.audit.latitude = position.coords.latitude;
          this.audit.longitude = position.coords.longitude;

          this.renderMapComplete = true;

          this.toastService.show("Location found!");
        })
        .catch(() => {
          this.toastService.show("Your location could not be found!");
          this.audit.location = false;
          this.audit.latitude = undefined;
          this.audit.longitude = undefined;
        });
    } else {
      this.renderMapComplete = false;
      this.audit.location = false;
      this.audit.latitude = undefined;
      this.audit.longitude = undefined;
    }
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

  async listFiles() {
    this.storageService
      .listAudit(this.audit.controlId, this.audit.id)
      .then((files) => {
        this.files = files;
      });
  }

  async removePicture(file: Attachment) {
    const confirm = await this.cameraService.deleteConfirmationAlert();
    if (confirm) {
      this.storageService
        .deleteAudit(this.audit.controlId, this.audit.id, file.name)
        .then(() => {
          this.listFiles();
        });
    }
  }
}
