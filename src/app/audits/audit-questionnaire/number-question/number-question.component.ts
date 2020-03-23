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

  from: string;
  to: string;

  constructor() { }

  ngOnInit() {
    this.from = this.question.numberOptions.from.toString();
    this.to = this.question.numberOptions.to.toString();
    console.log("from : " + this.from.toString());
    console.log("to : " + this.to.toString());
  }

}
