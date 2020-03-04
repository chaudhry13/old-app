import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { QuestionGroupDetails } from 'src/app/_models/questionnaire';

@Component({
  selector: 'question-group',
  templateUrl: './question-group.component.html',
  styleUrls: ['./question-group.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionGroupComponent implements OnInit {
  @Input() questionGroup: QuestionGroupDetails;

  constructor() { }

  ngOnInit() {
  }

}
