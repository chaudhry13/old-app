import { QuestionnaireHelperService } from "../../services/questionnaire-helper.service";
import { ValidationService } from "../../services/validation.service";
import { Component, Input, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  Question,
  QuestionAnsweres,
  QuestionnaireUserAnswer,
  QuestionTypes,
} from "../../models/questionnaire";
import { FormBuilder, FormGroup } from "@angular/forms";
import { QuestionAnsweredService } from "../../services/questionnaire.service";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { IonTextarea, NavController } from "@ionic/angular";
import { ToastService } from "@app/services/toast.service";
import { CameraService } from '@app/services/photo.service';
import { StorageService } from '@app/services/storage.service';
import { Attachment } from "@app/models/file";
import { UserService } from '@app/services/user.service';
import { TokenService } from '@app/services/token.service';
import { AccountService } from '@app/services/account.service';
import { SettingsService } from '@app/settings/settings.service';
import { AppConfigService } from '@app/services/auth-config.service';

@Component({
  selector: "question",
  templateUrl: "./question.component.html",
  styleUrls: ["./question.component.scss"],
})
export class QuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;
  @Input() isInGroup: boolean;
  @Input() isReadOnly: boolean;

  @ViewChild("comment") commentTextArea: IonTextarea;

  QuestionTypes = QuestionTypes;
  questionAnswer: QuestionAnsweres;
  answerForm: FormGroup;
  hasComment = false;
  showComment = false;
  public files: Attachment[];
  public photos: any[] = [];

  constructor(
    public formBuilder: FormBuilder,
    public validationService: ValidationService,
    public qhs: QuestionnaireHelperService,
    public questionAnsweredService: QuestionAnsweredService,
    private navCtrl: NavController,
    public toastService: ToastService,
    public cameraService: CameraService,
    public storageService: StorageService,
    public appConfigService: AppConfigService
  ) {
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
    });
  }

  ngOnInit() {
    this.questionAnswer = this.qhs.findQuestionAnswer(
      this.question.id,
      this.questionnaireUserAnswer
    );

    if (this.questionAnswer != null) {
      this.answerForm.controls.na.setValue(this.questionAnswer.na);
      if (!this.qhs.isNullOrWhitespace(this.questionAnswer.comment)) {
        this.answerForm.controls.comment.setValue(this.questionAnswer.comment);
        this.hasComment = true;
      }
    }

    this.answerForm.valueChanges
      .pipe(debounceTime(2000), distinctUntilChanged())
      .subscribe(() => {
        this.hasComment = !this.qhs.isNullOrWhitespace(
          this.answerForm.controls.comment.value
        );

        if (
          this.validationService.isQuestionAnswerValid(
            this.question,
            this.answerForm
          ).isValid
        ) {
          const answer = this.qhs.getQuestionAnswer(
            this.questionAnswer,
            this.question,
            this.questionnaireUserAnswer,
            this.answerForm
          );
          this.questionAnsweredService
            .update(answer)
            .then(() => {
              this.toastService.show("Answer saved!");
            })
            .catch(() => {
              this.toastService.show("Could not save answer!");
            });
        }
      });

    this.listQuestionFiles();
  }

  toggleComment() {
    this.showComment = !this.showComment;
    if (this.showComment) {
      setTimeout(() => {
        // Needs timeout to setFocus()
        this.commentTextArea.setFocus().then();
      }, 200);
    }
  }

  public takePhotoAndUpload() {
    var questionFilesStorageUrl = this.getQuestionFilesStorageUrl();

    this.cameraService
      .takePhotoAndUpload(
        questionFilesStorageUrl,
        this.photos.length
      )
      .then((result) => {
        if (result) this.listQuestionFiles();
      })
      .catch(() => {
        // This is taken care of in takePhotoAndUpload()
      });
  }

  private getQuestionFilesStorageUrl() {
    return "/questionnaire?organizationId=" + this.getUserOrgId() + "&questionnaireId="
      + this.question.questionnaireId + "&sentOutId=" + this.questionnaireUserAnswer.questionnaireSentOutId + "&questionnaireUserAnswerId="
      + this.questionnaireUserAnswer.id + "&questionAnswerId=" + this.questionAnswer.id + "&fileName=" + this.photos.length;
  }

  private getUserOrgId() {
    return this.appConfigService.organizationId;
  }

  private async listQuestionFiles() {
    this.storageService
      .listQuestionnaire(this.question.questionnaireId,
        this.questionnaireUserAnswer.questionnaireSentOutId,
        this.questionnaireUserAnswer.id,
        this.questionAnswer.id)
      .then((files) => {
        this.files = files;
      });
  }

  public async removePicture(file: Attachment) {
    const confirm = await this.cameraService.deleteConfirmationAlert();
    if (confirm) {
      this.storageService
        .deleteQuestionnaire(this.question.questionnaireId,
          this.questionnaireUserAnswer.questionnaireSentOutId,
          this.questionnaireUserAnswer.id,
          this.questionAnswer.id, file.name)
        .then(() => {
          this.listQuestionFiles();
        });
    }
  }
}
