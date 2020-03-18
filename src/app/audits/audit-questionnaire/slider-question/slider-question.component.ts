import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionnaireUserAnswer, Question } from 'src/app/_models/questionnaire';

@Component({
  selector: 'slider-question',
  templateUrl: './slider-question.component.html',
  styleUrls: ['./slider-question.component.scss'],
})
export class SliderQuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;
  @Input() answerForm: FormGroup;

  constructor() { }

  ngOnInit() { }

}
