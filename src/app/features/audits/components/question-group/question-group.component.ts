import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { QuestionGroupDetails, QuestionnaireUserAnswer } from '../../models/questionnaire';

@Component({
  selector: 'question-group',
  templateUrl: './question-group.component.html',
  styleUrls: ['./question-group.component.scss']
})
export class QuestionGroupComponent implements OnInit {
  @Input() questionGroup: QuestionGroupDetails;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;
  @Input() isReadOnly: boolean;

  constructor() { }

  ngOnInit() {
  }
}
