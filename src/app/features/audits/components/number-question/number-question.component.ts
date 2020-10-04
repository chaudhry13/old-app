import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionnaireUserAnswer, Question, QuestionAnsweres, QuestionAnsweredEdit } from '../../models/questionnaire';

@Component({
  selector: 'number-question',
  templateUrl: './number-question.component.html',
  styleUrls: ['./number-question.component.scss'],
})
export class NumberQuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;
  @Input() answerForm: FormGroup;
  @Input() questionAnswer: QuestionAnsweres;
  @Input() isReadOnly: boolean;

  from: string;
  to: string;

  constructor() { }

  ngOnInit() {
    if (this.questionAnswer != null) {
      this.answerForm.controls.numberAnswer.setValue(this.questionAnswer.numberAnswer);
    }

    this.from = this.question.numberOptions.from.toString();
    this.to = this.question.numberOptions.to.toString();
  }
}
