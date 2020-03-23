import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionnaireUserAnswer, Question } from 'src/app/_models/questionnaire';

@Component({
  selector: 'number-question',
  templateUrl: './number-question.component.html',
  styleUrls: ['./number-question.component.scss'],
})
export class NumberQuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;
  @Input() answerForm: FormGroup;

  from: number;
  to: number;

  constructor() { }

  ngOnInit() {
    this.from = this.question.numberOptions.from;
    this.to = this.question.numberOptions.to;
    console.log("from : " + this.from);
    console.log("to : " + this.to);
  }

}
