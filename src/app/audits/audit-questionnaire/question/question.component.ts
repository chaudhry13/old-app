import { QuestionnaireHelperService } from '../../../_services/questionnaire-helper.service';
import { ValidationService } from '../../../_services/validation.service';
import { Component, Input, OnInit } from '@angular/core';
import { Question, QuestionAnsweres, QuestionnaireUserAnswer, QuestionTypes } from 'src/app/_models/questionnaire';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  hasComment = false;
  showComment = false;

  constructor(
    public formBuilder: FormBuilder,
    public validationService: ValidationService,
    public qhs: QuestionnaireHelperService,
    public questionAnsweredService: QuestionAnsweredService) {
    this.answerForm = this.formBuilder.group({
      id: [''],
      questionId: [''],
      userAnswerId: [''],
      text: [''],
      slider: [0],
      numberAnswer: [0],
      comment: [''],
      na: [false],
      answered: [false]
    });
  }

  ngOnInit() {
    this.questionAnswer = this.qhs.findQuestionAnswer(this.question.id, this.questionnaireUserAnswer);

    if (this.questionAnswer != null) {
      this.answerForm.controls.na.setValue(this.questionAnswer.na);
      if (!this.qhs.isNullOrWhitespace(this.questionAnswer.comment)) {
        this.answerForm.controls.comment.setValue(this.questionAnswer.comment);
        this.hasComment = true;
      }
    }

    this.answerForm.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        if (!this.qhs.isNullOrWhitespace(this.answerForm.controls.comment.value)) {
          this.hasComment = true;
        } else {
          this.hasComment = false;
        }

        if (this.validationService.isQuestionAnswerValid(this.question, this.answerForm).isValid) {
          const answer = this.qhs.getQuestionAnswer(this.questionAnswer, this.question, this.questionnaireUserAnswer, this.answerForm);
          console.log("na: " + answer.na);
          this.questionAnsweredService.update(answer);
        }
      });
  }

  toggleComment() {
    this.showComment = !this.showComment;
  }
}


