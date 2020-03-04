import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Question } from 'src/app/_models/questionnaire';

@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionComponent implements OnInit {
  @Input() question: Question;

  constructor() { }

  ngOnInit() {
    console.log(this.question);
  }

}
