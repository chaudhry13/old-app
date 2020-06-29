import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { Location } from 'src/app/_models/location';
import { AgmMap } from '@agm/core';
import { Question, QuestionnaireUserAnswer, QuestionAnsweres } from 'src/app/_models/questionnaire';
import { FormGroup } from '@angular/forms';

@Component({
  selector: "location-question",
  templateUrl: "location-question.component.html",
})
export class LocationQuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;
  @Input() answerForm: FormGroup;
  @Input() questionAnswer: QuestionAnsweres;
  @Input() isReadOnly: boolean;

  @ViewChild("map", { static: false }) myMap: AgmMap;

  location: Location;
  renderMap: boolean = true;

  constructor() {
    this.location = new Location()
    this.location.lat = 51;
    this.location.lng = 9;
  }

  ngOnInit() {
    if (this.questionAnswer != null) {
      this.answerForm.controls.locationAnswer.setValue(this.questionAnswer.locationAnswer);
    }
  }
}
