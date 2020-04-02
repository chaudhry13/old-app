import { QuestionnaireHelperService } from './../../../_services/questionnaire-helper.service';
import { ValidationService } from './../../../_services/validation.service';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Question, QuestionTypes, QuestionTextType, QuestionOption, QuestionnaireUserAnswer, QuestionAnsweres, QuestionAnsweredEdit, optionAnswerFromQuestionAnswer } from 'src/app/_models/questionnaire';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/_services/toast.service';
import { QuestionAnsweredService } from 'src/app/_services/questionnaire.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;
  @Input() isInGroup: boolean;

  QuestionTypes = QuestionTypes;
  questionAnswer: QuestionAnsweres;
  answerForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public validationService: ValidationService,
    public qhs: QuestionnaireHelperService,
    public questionAnsweredService: QuestionAnsweredService) {

    this.answerForm = this.formBuilder.group({
      id: [""],
      questionId: [""],
      userAnswerId: [""],
      text: [""],
      slider: [0],
      numberAnswer: [0],
      comment: [""],
      na: [false],
      answered: [false]
    });
  }

  ngOnInit() {
    this.questionAnswer = this.qhs.findQuestionAnswer(this.question.id, this.questionnaireUserAnswer);

    this.answerForm.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        if (this.question.type == QuestionTypes.Number) {
          console.log("Number validity: " + this.validationService.isQuestionAnswerValid(this.question, this.answerForm).isValid)
        }
        if (this.validationService.isQuestionAnswerValid(this.question, this.answerForm).isValid) {
          var answer = this.qhs.getQuestionAnswer(this.questionAnswer, this.question, this.questionnaireUserAnswer, this.answerForm);
          this.questionAnsweredService.update(answer);
        }
      });
  }
}


