import { QuestionnaireHelperService } from "../../../_services/questionnaire-helper.service";
import { ValidationService } from "../../../_services/validation.service";
import { Component, Input, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  Question,
  QuestionAnsweres,
  QuestionnaireUserAnswer,
  QuestionTypes,
} from "src/app/_models/questionnaire";
import { FormBuilder, FormGroup } from "@angular/forms";
import { QuestionAnsweredService } from "src/app/_services/questionnaire.service";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { IonTextarea, NavController } from "@ionic/angular";
import { ToastService } from "../../../_services/toast.service";

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
  // var url = "/questionnaire?organizationId=" + this.organizationId + "&questionnaireId="
  // + this.questionnaireId + "&sentOutId=" + this.sentOutId + "&questionnaireUserAnswerId=
  // + this.questionnaireUserAnswerId + "&questionAnswerId=" + this.questionAnswerId + "&fileName=";
  constructor(
    public formBuilder: FormBuilder,
    public validationService: ValidationService,
    public qhs: QuestionnaireHelperService,
    public questionAnsweredService: QuestionAnsweredService,
    private navCtrl: NavController,
    public toastService: ToastService
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
      locationAnswer: [],
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
}
