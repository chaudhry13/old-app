import { QuestionnaireHelperService } from "../../services/questionnaire-helper.service";
import { ValidationService } from "../../services/validation.service";
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Injectable,
} from "@angular/core";
import {
  Question, QuestionAnsweredEdit,
  QuestionAnsweres,
  QuestionnaireUserAnswer,
  QuestionTypes,
} from "../../models/questionnaire";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  QuestionAnsweredService,
  QuestionnaireUserAnswerService,
} from "../../services/questionnaire.service";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import {
  AlertController,
  AnimationController,
  IonTextarea,
  ModalController,
  NavController,
  Animation,
} from "@ionic/angular";
import { ToastService } from "@app/services/toast.service";
import { CameraService } from "@app/services/photo.service";
import { StorageService } from "@app/services/storage.service";
import { Attachment } from "@app/models/file";
import { UserService } from "@app/services/user.service";
import { AppConfigService } from "@app/services/app-config.service";
import { CommentService } from "@app/services/comment.service";
import { AuditService } from "../../services/audit.service";
import { ActivatedRoute } from "@angular/router";
import { CommentType } from "@app/models/comment";
import { Comment } from "@app/models/comment";
import { CommentModalComponent } from "../comment-modal/comment-modal.component";
import { IssueModalComponent } from "../issue-modal/issue-modal.component";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "question",
  templateUrl: "./question.component.html",
  styleUrls: ["./question.component.scss"],
})
export class QuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() isInGroup: boolean;
  @Input() isReadOnly: boolean;

  hasComment: boolean = false;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;
  @Output() questionnaireUserAnswerChange = new EventEmitter();
  @Input()
  id: string;
  @ViewChild("comment") commentTextArea: IonTextarea;

  @Output() questionnaireUserAnswerToParent = new EventEmitter();
  showCreateComment: boolean = false;

  commentId: string[];
  common: FormGroup;
  isInRole: string;
  issueId: string;
  requireComment: boolean = false;

  commentData: Comment[] = [];
  questionData: QuestionAnsweres[];

  QuestionTypes = QuestionTypes;
  questionAnswer: QuestionAnsweres;
  answerForm: FormGroup;
  showComment = false;
  public files: Attachment[];
  public photos: any[] = [];

  animation: Animation;
  errorMsg: string = null;
  hasError: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public validationService: ValidationService,
    public qhs: QuestionnaireHelperService,
    public questionAnsweredService: QuestionAnsweredService,
    private navCtrl: NavController,
    public toastService: ToastService,
    public cameraService: CameraService,
    public storageService: StorageService,
    public appConfigService: AppConfigService,
    public commentService: CommentService,
    public qua: QuestionnaireUserAnswerService,
    public auditsService: AuditService,
    public activatedRoute: ActivatedRoute,
    public questionaireUserAnswerService: QuestionnaireUserAnswerService,
    public modelController: ModalController,
    private userService: UserService,
    public alertController: AlertController,
    public animationController: AnimationController,
    private auth: AuthService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.answerForm = this.formBuilder.group({
      id: [""],
      questionId: [""],
      userAnswerId: [""],
      text: [""],
      slider: [0],
      numberAnswer: [0],
      comment: [""],
      na: [false],
      answered: [false],
      locationAnswer: [null],
      optionAnswered: [[]],
    });
  }

  async openCommentModal() {
    const modal = this.modelController.create({
      component: CommentModalComponent,
    });
    (await modal).onDidDismiss().then((data) => {
      this.commentService
        .insertComment({
          riskAssessmentId: null,
          incidentReportId: null,
          commentId: null,
          activityLogId: null,
          activityId: null,
          auditId: null,
          questionAnswerId: this.questionAnswer.id,
          text: data.data.comment,
        })
        .then((val) => {
          this.requireComment = false;
          this.getCommentById();
        });
    });
    return (await modal).present();
  }

  async onCreateComment() {
    this.showCreateComment = !this.showCreateComment;
    const modal = this.modelController.create({
      component: CommentModalComponent,
    });
    (await modal).onDidDismiss().then((data) => {
      this.commentService
        .insertComment({
          riskAssessmentId: null,
          incidentReportId: null,
          commentId: null,
          activityLogId: null,
          activityId: null,
          auditId: null,
          questionAnswerId: this.questionAnswer.id,
          text: data.data.comment,
        })
        .then((val) => {
          this.showComment = true;
          this.getCommentById();
        });
    });
    return (await modal).present();
  }
  async onReplayComment(id) {
    const modal = this.modelController.create({
      component: CommentModalComponent,
    });
    (await modal).onDidDismiss().then((data) => {
      this.commentService
        .insertComment({
          riskAssessmentId: null,
          incidentReportId: null,
          commentId: id,
          activityLogId: null,
          activityId: null,
          auditId: null,
          questionAnswerId: this.questionAnswer.id,
          text: data.data.comment,
        })
        .then((val) => {
          this.getCommentById();
        });
    });
    return (await modal).present();
  }

  async onDeleteChildComment(id) {
    const alert = this.alertController.create({
      header: "Delete",
      message: "Are you sure you want to delete the comment?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {},
        },
        {
          text: "Delete",
          handler: async () => {
            await this.commentService.delete(id).then((val) => {});
            this.getCommentById();
          },
        },
      ],
    });
    return await (await alert).present();
  }

  async onDeleteComment(id) {
    const alert = this.alertController.create({
      header: "Delete",
      message: "Are you sure you want to delete the comment?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {},
        },
        {
          text: "Delete",
          handler: async () => {
            await this.commentService.delete(id).then((val) => {});
            this.getCommentById();
          },
        },
      ],
    });
    return await (await alert).present();
  }

  startAnimationOfIssueButton() {
    this.animation = this.animationController
      .create()
      .addElement(document.querySelectorAll(".alertIcon"))
      .duration(1000)
      .iterations(Infinity)
      .fromTo("transform", "scale(1)", "scale(0.8)")
      .fromTo("opacity", "1", "0.4");

    this.animation.play();
  }

  ngOnDestroy() {
    this.animation.stop();
  }

  ngOnInit() {
    this.questionAnswer = this.qhs.findQuestionAnswer(
      this.question.id,
      this.questionnaireUserAnswer
    );
    this.startAnimationOfIssueButton();
    this.issueId = this.questionAnswer.issueId;

    this.questionaireUserAnswerService.get(this.id).then((val) => {
      this.userService.get(val.userId).forEach((val) => {
        this.isInRole = val.role;
      });
    });

    if (this.questionAnswer.na && !this.questionAnswer.hasComment) {
      this.requireComment = true;
    } else if (
      this.checkOptionRequireComment() &&
      !this.questionAnswer.hasComment
    ) {
      this.requireComment = true;
    } else {
      this.requireComment = false;
    }

    if (this.questionAnswer != null) {
      this.answerForm.controls.na.setValue(this.questionAnswer.na);
      this.hasComment = this.questionAnswer.hasComment;
    }

    /*
      if (!this.qhs.isNullOrWhitespace(this.questionAnswer.comment)) {
        this.answerForm.controls.comment.setValue(this.questionAnswer.comment);
        this.hasComment = true;
      }*/

    // Update the answer in the database
    this.answerForm.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe(() => {
        var validation = this.validationService.isQuestionAnswerValid(this.question, this.answerForm);
        this.errorMsg = validation.errorMsg;
        this.hasError = !validation.isValid;
        
        if (validation.isValid) {
          const answer = this.qhs.getQuestionAnswer(
            this.questionAnswer,
            this.question,
            this.questionnaireUserAnswer,
            this.answerForm
          );

          this.questionAnsweredService
            .update(answer)
            .then((data) => {
              if(data){
                this.updateQuestionAnswers(answer);

                if (answer.na && answer.answered && !this.hasComment) {
                  this.requireComment = true;
                  this.openCommentModal();
                } else if (this.checkOptionRequireComment()) {
                  this.requireComment = true;
                  this.openCommentModal();
                } else {
                  this.requireComment = false;
                }
                this.toastService.show("Answer saved!");
              }
            })
            .catch(() => {
              this.toastService.show("Could not save answer!");
            });
        }
      });

    this.listQuestionFiles();
  }

  updateQuestionAnswers(answer: QuestionAnsweredEdit){
    // find the questionAnsweres and update with the new answer data
    let index = this.questionnaireUserAnswer.questionAnsweres
        .findIndex((qa) => qa.id == this.questionAnswer.id);
    this.questionnaireUserAnswer.questionAnsweres[index] = <QuestionAnsweres>
        {
          id: answer.id,
          answered: true,
          questionId: answer.questionId,
          text: answer.text,
          slider: answer.slider,
          numberAnswer: answer.numberAnswer,
          hasComment: false,
          na: answer.na,
          question: this.question,
          filesUploaded: 0,
          userAnswerId: answer.userAnswerId,
          locationAnswer: answer.locationAnswer,
          optionAnswered: answer.optionAnswered,
          issueId: null,
          isIssue: null,
        };
    // Send signal to update the logic
    this.questionnaireUserAnswerChange.emit(this.questionnaireUserAnswer);
  }

  checkOptionRequireComment(): boolean {
    var require = this.questionAnswer.optionAnswered
      .filter((o) => o.selected)
      .some((o) => {
        var found = this.question.possibleAnswers.find(
          (p) => p.id == o.questionOptionId
        );
        return found.requireComment;
      });

    return require && !this.hasComment;
  }

  toggleComment() {
    this.showComment = !this.showComment;
    if (this.showComment) {
      setTimeout(() => {
        // Needs timeout to setFocus()
        this.commentTextArea.setFocus().then();
      }, 200);
    }
    this.getCommentById();
  }
  async toggleIssue() {
    const issueModal = this.modelController.create({
      component: IssueModalComponent,
      componentProps: {
        id: this.id,
        questionAnswer: this.questionAnswer,
        questionnaireUserAnswer: this.questionnaireUserAnswer,
        answerForm: this.answerForm,
        hasComment: this.hasComment,
        isInRole: this.isInRole,
        question: this.question,
        issueId: this.issueId,
      },
    });

    return (await issueModal).present();
  }
  getCommentById() {
    this.commentService.list(this.questionAnswer.id, 6).then((val) => {
      this.commentData = val;
      this.showCreateComment = !this.showCreateComment;
      if (val && val.length > 0) {
        this.hasComment = true;
      } else {
        this.hasComment = false;
      }

      if (
        (this.answerForm.controls.na.value ||
          this.checkOptionRequireComment()) &&
        !this.hasComment
      ) {
        this.requireComment = true;
      } else {
        this.requireComment = false;
      }
    });
  }

  public takePhotoAndUpload() {
    var questionFilesStorageUrl = this.getQuestionFilesStorageUrl();

    this.cameraService
      .takePhotoAndUpload(questionFilesStorageUrl, this.photos.length)
      .then((result) => {
        if (result) this.listQuestionFiles();
      })
      .catch(() => {
        // This is taken care of in takePhotoAndUpload()
      });
  }

  private getQuestionFilesStorageUrl() {
    return (
      "/questionnaire?organizationId=" +
      this.getUserOrgId() +
      "&questionnaireId=" +
      this.question.questionnaireId +
      "&sentOutId=" +
      this.questionnaireUserAnswer.questionnaireSentOutId +
      "&questionnaireUserAnswerId=" +
      this.questionnaireUserAnswer.id +
      "&questionAnswerId=" +
      this.questionAnswer.id +
      "&fileName=" +
      this.photos.length
    );
  }

  private getUserOrgId() {
    return this.auth.user.organization;
  }

  private async listQuestionFiles() {
    this.storageService
      .listQuestionnaire(
        this.question.questionnaireId,
        this.questionnaireUserAnswer.questionnaireSentOutId,
        this.questionnaireUserAnswer.id,
        this.questionAnswer.id
      )
      .then((files) => {
        this.files = files;
      });
  }

  public async removePicture(file: Attachment) {
    const confirm = await this.cameraService.deleteConfirmationAlert();
    if (confirm) {
      this.storageService
        .deleteQuestionnaire(
          this.question.questionnaireId,
          this.questionnaireUserAnswer.questionnaireSentOutId,
          this.questionnaireUserAnswer.id,
          this.questionAnswer.id,
          file.name
        )
        .then(() => {
          this.listQuestionFiles();
        });
    }
  }
}
