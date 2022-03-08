import { QuestionnaireHelperService } from "../../services/questionnaire-helper.service";
import { Component, OnInit, Input } from "@angular/core";
import { Audit, AuditStatus } from "../../models/audit";
import { Router, ActivatedRoute } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { AuditService } from "../../services/audit.service";
import { CameraService } from "@app/services/photo.service";
import { ToastService } from "@app/services/toast.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ControlService } from "../../services/control.service";
import { User } from "@app/models/user";
import { Attachment } from "@app/models/file";
import { StorageService } from "@app/services/storage.service";
import { AppConfigService } from "@app/services/app-config.service";
import { FollowUpService } from "../../services/follow-up.service";
import { FollowUp } from "../../models/follow-up";
import { UserService } from "@app/services/user.service";
import { CommentService } from "@app/services/comment.service";
import { AuthService } from "src/app/auth/auth.service";

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

  subjectForReview: boolean;
  // approveVisible: boolean = false;
  rejectVisible: boolean = false;
  hasQuestionnaires = false;
  questionnairesIsLoading = false;
  completeTaskBtnVisible: boolean = false;
  approveVisible: boolean = false;

  auditForm: FormGroup;
  sendToForm: FormGroup;
  rejectText: String = "";
  returnBtnText: String = "";
  returnBtnVisible: Boolean = false;
  rejectTextBtnVisible: Boolean = false;

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
    public storageService: StorageService,
    public appConfigService: AppConfigService,
    public followUpService: FollowUpService,
    public userService: UserService,
    public qhs: QuestionnaireHelperService,
    private commentService: CommentService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
  }

  approveAudit() {
    // let firstUser = this.audit.flow[0].id;
    // let secondUser = this.audit.flow[1].id;
    // let thirdUser = this.audit.flow[2].id;
    if (
      this.audit.currentId === this.audit.flow[0].id &&
      this.audit.flow.length === 3 &&
      this.audit.flow[0].id !== this.audit.flow[1].id &&
      this.audit.flow[1].id !== this.audit.flow[2].id
    ) {
      this.sendToForm = this.formBuilder.group({
        id: this.audit.id,
        followUp: false,
        remarks: "",
        other: "",
        sendToId: this.audit.flow[1].id,
        status: 3,
      });
      this.auditService.sendTo(this.sendToForm).then((val) => {
        if (val) {
          this.auditService
            .postList({
              controlId: this.audit.controlId,
              status: null,
              current: null,
              version: null,
              startDate: null,
              endDate: null,
            })
            .then((val) => {
              this.getAudit();
              this.router
                .navigate(["/tabs/tab1/details/" + this.audit.controlId])
                .then(() => {
                  this.toastService.show("Approved");
                });
            });
        }
      });
    } else if (
      this.audit.currentId === this.audit.flow[1].id &&
      this.audit.flow.length === 3 &&
      this.audit.flow[0].id !== this.audit.flow[1].id &&
      this.audit.flow[1].id !== this.audit.flow[2].id
    ) {
      this.sendToForm = this.formBuilder.group({
        id: this.audit.id,
        followUp: false,
        remarks: "",
        other: "",
        sendToId: this.audit.flow[2].id,
        status: 3,
      });
      this.auditService.sendTo(this.sendToForm).then((val) => {
        if (val) {
          this.auditService
            .postList({
              controlId: this.audit.controlId,
              status: null,
              current: null,
              version: null,
              startDate: null,
              endDate: null,
            })
            .then((val) => {
              this.getAudit();
              this.router
                .navigate(["/tabs/tab1/details/" + this.audit.controlId])
                .then(() => {
                  this.toastService.show("Approved");
                });
            });
        }
      });
    } else if (
      this.audit.currentId === this.audit.flow[0].id &&
      this.audit.flow.length === 2 &&
      this.audit.flow[0].id !== this.audit.flow[1].id
    ) {
      this.sendToForm = this.formBuilder.group({
        id: this.audit.id,
        followUp: false,
        remarks: "",
        other: "",
        sendToId: this.audit.flow[1].id,
        status: 3,
      });
      this.auditService.sendTo(this.sendToForm).then((val) => {
        if (val) {
          this.auditService
            .postList({
              controlId: this.audit.controlId,
              status: null,
              current: null,
              version: null,
              startDate: null,
              endDate: null,
            })
            .then((val) => {
              this.getAudit();
              this.router
                .navigate(["/tabs/tab1/details/" + this.audit.controlId])
                .then(() => {
                  this.toastService.show("Approved");
                });
            });
        }
      });
    } else if (
      this.audit.currentId === this.audit.flow[0].id &&
      this.audit.flow.length === 2 &&
      this.audit.flow[0].id === this.audit.flow[1].id
    ) {
      this.sendToForm = this.formBuilder.group({
        id: this.audit.id,
        followUp: false,
        remarks: "",
        other: "",
        sendToId: this.audit.flow[1].id,
        status: 3,
      });
      this.auditService.sendTo(this.sendToForm).then((val) => {
        if (val) {
          this.auditService
            .postList({
              controlId: this.audit.controlId,
              status: null,
              current: null,
              version: null,
              startDate: null,
              endDate: null,
            })
            .then((val) => {
              this.getAudit();
              this.router
                .navigate(["/tabs/tab1/details/" + this.audit.controlId])
                .then(() => {
                  this.toastService.show("Approved");
                });
            });
        }
      });
    } else {
      console.log("Clicked");
    }

    // this.auditService.canFinishAudit(this.audit.id).then((val) => {
    //   if (val) {
    //     this.sendToForm = this.formBuilder.group({
    //       id: this.audit.id,
    //       followUp: false,
    //       remarks: "",
    //       other: "",
    //       sendToId: null,
    //       status: 1,
    //     });
    //     this.auditService.complete(this.sendToForm).then((val) => {
    //       if (val) {
    //         this.router
    //           .navigate(["/tabs/tab1/details/" + this.audit.controlId])
    //           .then(() => {
    //             this.toastService.show("Audit Completed.");
    //           });
    //       }
    //     });
    //   }
    // });
  }
  // returnToFirstUser() {
  //   if (this.audit.flow.length === 3) {
  //     this.getAudit();
  //     this.sendToForm = this.formBuilder.group({
  //       id: this.audit.id,
  //       followUp: false,
  //       remarks: "",
  //       other: "",
  //       sendToId: this.audit.flow[0].id,
  //       status: 2,
  //     });
  //     this.auditService.sendTo(this.sendToForm).then((val) => {
  //       if (val) {
  //         this.auditService
  //           .postList({
  //             controlId: this.audit.controlId,
  //             status: null,
  //             current: null,
  //             version: null,
  //             startDate: null,
  //             endDate: null,
  //           })
  //           .then((val) => {
  //             this.getAudit();
  //             this.router
  //               .navigate(["/tabs/tab1/details/" + this.audit.controlId])
  //               .then(() => {
  //                 this.toastService.show("Success");
  //               });
  //           });
  //       }
  //     });
  //   }
  // }

  onCompleteTask() {
    this.sendToForm = this.formBuilder.group({
      id: this.audit.id,
      followUp: false,
      remarks: "",
      other: "",
      sendToId: null,
      status: 1,
    });
    this.auditService.complete(this.sendToForm).then((val) => {
      if (val) {
        this.router
          .navigate(["/tabs/tab1/details/" + this.audit.controlId])
          .then(() => {
            this.toastService.show("Task Completed");
          });
      }
    });
  }
  rejectAudit() {
    if (this.audit.currentId === this.audit.flow[1].id) {
      this.sendToForm = this.formBuilder.group({
        id: this.audit.id,
        followUp: false,
        remarks: "",
        other: "",
        sendToId: this.audit.flow[0].id,
        status: 2,
      });
      this.auditService.sendTo(this.sendToForm).then((val) => {
        if (val) {
          this.auditService
            .postList({
              controlId: this.audit.controlId,
              status: null,
              current: null,
              version: null,
              startDate: null,
              endDate: null,
            })
            .then((val) => {
              this.getAudit();
              this.router
                .navigate(["/tabs/tab1/details/" + this.audit.controlId])
                .then(() => {
                  this.toastService.show("Rejected");
                });
            });
        }
      });
    } else if (this.audit.currentId === this.audit.flow[2].id) {
      this.sendToForm = this.formBuilder.group({
        id: this.audit.id,
        followUp: false,
        remarks: "",
        other: "",
        sendToId: this.audit.flow[1].id,
        status: 2,
      });
      this.auditService.sendTo(this.sendToForm).then((val) => {
        if (val) {
          this.auditService
            .postList({
              controlId: this.audit.controlId,
              status: null,
              current: null,
              version: null,
              startDate: null,
              endDate: null,
            })
            .then((val) => {
              this.getAudit();
              this.router
                .navigate(["/tabs/tab1/details/" + this.audit.controlId])
                .then(() => {
                  this.toastService.show("Rejected");
                });
            });
        }
      });
    }

    // if (this.audit.flow.length === 3) {
    //   if (this.audit.currentId === this.audit.flow[0].id) {
    //     this.sendToForm = this.formBuilder.group({
    //       id: this.audit.id,
    //       followUp: false,
    //       remarks: "",
    //       other: "",
    //       sendToId: this.audit.flow[1].id,
    //       status: 3,
    //     });
    //     this.auditService.sendTo(this.sendToForm).then((val) => {
    //       if (val) {
    //         this.auditService
    //           .postList({
    //             controlId: this.audit.controlId,
    //             status: null,
    //             current: null,
    //             version: null,
    //             startDate: null,
    //             endDate: null,
    //           })
    //           .then((val) => {
    //             this.getAudit();
    //             this.router
    //               .navigate(["/tabs/tab1/details/" + this.audit.controlId])
    //               .then(() => {
    //                 this.toastService.show("Success");
    //               });
    //           });
    //       }
    //     });
    //   } else if (this.audit.currentId === this.audit.flow[1].id) {
    //     this.sendToForm = this.formBuilder.group({
    //       id: this.audit.id,
    //       followUp: false,
    //       remarks: "",
    //       other: "",
    //       sendToId: this.audit.flow[2].id,
    //       status: 3,
    //     });
    //     this.auditService.sendTo(this.sendToForm).then((val) => {
    //       if (val) {
    //         this.auditService
    //           .postList({
    //             controlId: this.audit.controlId,
    //             status: null,
    //             current: null,
    //             version: null,
    //             startDate: null,
    //             endDate: null,
    //           })
    //           .then((val) => {
    //             this.getAudit();
    //             this.router
    //               .navigate(["/tabs/tab1/details/" + this.audit.controlId])
    //               .then(() => {
    //                 this.toastService.show("Success");
    //               });
    //           });
    //       }
    //     });
    //   } else if (this.audit.currentId === this.audit.flow[2].id) {
    //     this.sendToForm = this.formBuilder.group({
    //       id: this.audit.id,
    //       followUp: false,
    //       remarks: "",
    //       other: "",
    //       sendToId: this.audit.flow[1].id,
    //       status: 2,
    //     });
    //     this.auditService.sendTo(this.sendToForm).then((val) => {
    //       if (val) {
    //         this.auditService
    //           .postList({
    //             controlId: this.audit.controlId,
    //             status: null,
    //             current: null,
    //             version: null,
    //             startDate: null,
    //             endDate: null,
    //           })
    //           .then((val) => {
    //             this.getAudit();
    //             this.router
    //               .navigate(["/tabs/tab1/details/" + this.audit.controlId])
    //               .then(() => {
    //                 this.toastService.show("Success");
    //               });
    //           });
    //       }
    //     });
    //   }
    // } else if (this.audit.flow.length === 2) {
    //   if (this.audit.currentId === this.audit.flow[0].id) {
    //     this.sendToForm = this.formBuilder.group({
    //       id: this.audit.id,
    //       followUp: false,
    //       remarks: "",
    //       other: "",
    //       sendToId: this.audit.flow[1].id,
    //       status: 3,
    //     });
    //     this.auditService.sendTo(this.sendToForm).then((val) => {
    //       if (val) {
    //         this.auditService
    //           .postList({
    //             controlId: this.audit.controlId,
    //             status: null,
    //             current: null,
    //             version: null,
    //             startDate: null,
    //             endDate: null,
    //           })
    //           .then((val) => {
    //             this.getAudit();
    //             this.router
    //               .navigate(["/tabs/tab1/details/" + this.audit.controlId])
    //               .then(() => {
    //                 this.toastService.show("Success");
    //               });
    //           });
    //       }
    //     });
    //   } else if (this.audit.currentId === this.audit.flow[1].id) {
    //     this.sendToForm = this.formBuilder.group({
    //       id: this.audit.id,
    //       followUp: false,
    //       remarks: "",
    //       other: "",
    //       sendToId: this.audit.flow[0].id,
    //       status: 2,
    //     });
    //     this.auditService.sendTo(this.sendToForm).then((val) => {
    //       if (val) {
    //         this.auditService
    //           .postList({
    //             controlId: this.audit.controlId,
    //             status: null,
    //             current: null,
    //             version: null,
    //             startDate: null,
    //             endDate: null,
    //           })
    //           .then((val) => {
    //             this.getAudit();
    //             this.router
    //               .navigate(["/tabs/tab1/details/" + this.audit.controlId])
    //               .then(() => {
    //                 this.toastService.show("Success");
    //               });
    //           });
    //       }
    //     });
    //   }
    // }
  }

  ngOnInit() {
    this.user = this.auth.user;
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
        this.subjectForReview = data.subjectForReview;

        this.setButtons();
        /*if ( // If you are the last, you can complete
          (data.currentId === data.flow[2].id && data.flow.length === 2) || 
          (data.currentId === data.flow[3].id && data.flow.length === 3)
        ) {
          this.completeTaskBtnVisible = true;
        }

        if (
          (data.currentId === data.flow[0].id && data.flow.length === 2) ||
          (data.currentId === data.flow[0].id && data.flow.length === 3)
        ) {
          this.approveVisible = true;
        }
        else if (
          (data.currentId === data.flow[1].id && data.flow.length === 2) ||
          (data.currentId === data.flow[2].id && data.flow.length === 3)
        ) {
          this.rejectVisible = true;
          this.approveVisible = false;
          this.completeTaskBtnVisible = true;
        }
        else if (
          (data.currentId === data.flow[1].id && data.flow.length === 3)
        ) {
          this.rejectVisible = true;
          this.approveVisible = true;
        }*/

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

  setButtons() {
    if (!this.subjectForReview) {
      this.completeTaskBtnVisible = true;
      this.rejectVisible = false;
      this.approveVisible = false;
      return;
    }

    const flowIds = this.audit.flow.map((f) => f.id);
    const status = this.audit.status;
    var isAdmin = this.user.role == "Administrator";

    var newArr = flowIds.slice();
    var currentIsLast = false;

    currentIsLast = newArr[newArr.length - 1] == this.audit.currentId;
    newArr.splice(-1, 1);
    this.approveVisible =
      (isAdmin || newArr.some((f) => f == this.user.id)) && !currentIsLast;

    // You can approve if you are the last in the flow (or, if the "current" is the last in the flow)
    newArr = flowIds.slice().filter((x) => x != null);
    this.completeTaskBtnVisible =
      isAdmin || newArr.splice(-1, 1).some((x) => x == this.user.id);

    // You can reject if you are in the flow, but not the first or if you are an admin. But not if the audit is upcomming i.e. the first version of the audit
    newArr = flowIds.slice();
    var currentIsFirst = false;

    currentIsFirst = newArr[0] == this.audit.currentId;
    newArr.splice(0, 1);

    this.rejectVisible =
      status != AuditStatus.Upcoming &&
      (isAdmin || newArr.some((f) => f == this.user.id)) &&
      !currentIsFirst;
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
    const auditStorageUrlExt =
      "/audit?organizationId=" +
      this.user.organization +
      "&controlId=" +
      this.audit.controlId +
      "&auditId=" +
      this.audit.id +
      "&uid=" +
      this.user.id;
    this.cameraService
      .takePhotoAndUpload(auditStorageUrlExt, this.photos.length)
      .then((result) => {
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
