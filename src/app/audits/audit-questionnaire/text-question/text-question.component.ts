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

  QuestionTypes = QuestionTypes;
  textTypeToString = QuestionTextType;
  questionAnswer: QuestionAnsweres;

  viewAnswer: Boolean;

  message: string = "";
  pattern: string = "";

  Type: QuestionTextType;
  saving: boolean;
  saved: boolean;

  constructor() { }

  ngOnInit() { }
}
