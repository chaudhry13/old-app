import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { QuestionGroupDetails, QuestionnaireUserAnswer } from 'src/app/_models/questionnaire';

@Component({
  selector: 'question-group',
  templateUrl: './question-group.component.html',
  styleUrls: ['./question-group.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionGroupComponent implements OnInit {
  @Input() questionGroup: QuestionGroupDetails;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;

  constructor() { }

  ngOnInit() {
  }

}
