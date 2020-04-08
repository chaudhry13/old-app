import { Component, OnInit, Input } from '@angular/core';
import { Question, QuestionnaireUserAnswer, QuestionTypes, QuestionTextType, QuestionAnsweres } from 'src/app/_models/questionnaire';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'text-question',
  templateUrl: './text-question.component.html',
  styleUrls: ['./text-question.component.scss'],
})
export class TextQuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;
  @Input() answerForm: FormGroup;
  @Input() questionAnswer: QuestionAnsweres;

  QuestionTypes = QuestionTypes;
  textTypeToString = QuestionTextType;

  viewAnswer: boolean;

  constructor() { }

  ngOnInit() {
    if (this.questionAnswer != null) {
      this.answerForm.controls.text.setValue(this.questionAnswer.text);
    }
  }
}
