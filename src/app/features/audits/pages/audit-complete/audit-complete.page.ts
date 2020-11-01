import { QuestionnaireHelperService } from "../../services/questionnaire-helper.service";
import { Component, OnInit, Input } from "@angular/core";
import { Audit } from "../../models/audit";
import { Router, ActivatedRoute } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { AuditService } from "../../services/audit.service";
import { CameraService } from "@app/services/photo.service";
import { ToastService } from "@app/services/toast.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ControlService } from "../../services/control.service";
import {
  FileTransfer,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { TokenService } from "@app/services/token.service";
import { User } from "@app/models/user";
import { Attachment } from "@app/models/file";
import { StorageService } from "@app/services/storage.service";
import { AppConfigService } from "@app/services/auth-config.service";
import { FollowUpService } from "../../services/follow-up.service";
import { FollowUp } from "../../models/follow-up";
import { UserService } from "@app/services/user.service";
import { AuthService } from '@app/services/auth.service';

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
    public auth: AuthService,
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
    this.tokenService.readToken(this.auth.oAuth.getAccessToken());
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

  async takePhotoAndUpload() {
    const auditStorageUrlExt = "/audit?organizationId=" +
      this.user.organization +
      "&controlId=" +
      this.audit.controlId +
      "&auditId=" +
      this.audit.id +
      "&uid=" +
      this.user.id;
    this.cameraService.takePhotoAndUpload(auditStorageUrlExt, this.photos.length).then(result => {
      if (result) {
        this.listFiles();
      }
    });
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
