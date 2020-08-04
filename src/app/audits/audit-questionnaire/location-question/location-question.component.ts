import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { Location } from 'src/app/_models/location';
import { AgmMap, AgmMarker } from "@agm/core";
import { Question, QuestionnaireUserAnswer, QuestionAnsweres } from 'src/app/_models/questionnaire';
import { FormGroup } from '@angular/forms';

@Component({
  selector: "location-question",
  templateUrl: "location-question.component.html",
  styleUrls: ["location-question.component.scss"],
})
export class LocationQuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;
  @Input() answerForm: FormGroup;
  @Input() questionAnswer: QuestionAnsweres;
  @Input() isReadOnly: boolean;

  @ViewChild("map") myMap: AgmMap;
  @ViewChild("mapMarker") myMarker: AgmMarker;

  location: Location;
  renderMap: boolean = true;

  // TODO: GENERAL:
  // - Implement places api to search for addresses and relocate the pin to get the address (2-way with addresses)
  // - If no question answer exists yet, we should use the users current location (default one, if the dont allow it)

  constructor() {
    this.location = new Location()
    this.location.lat = 56.0956628;
    this.location.lng = 9.9716147;
  }

  ngOnInit() {
    if (this.questionAnswer != null) {
      var location = {
        address: this.questionAnswer.locationAnswer?.address,
        countryId: this.questionAnswer.locationAnswer?.country.id,
        latitude: this.questionAnswer.locationAnswer?.latitude,
        longitude: this.questionAnswer.locationAnswer?.longitude,
      }

      this.location.lat = this.questionAnswer.locationAnswer?.latitude;
      this.location.lng = this.questionAnswer.locationAnswer?.longitude;

      this.answerForm.controls.locationAnswer.setValue(location);
    }
  }

  newPosition(longitude, latitude, coords) {
    var location = {
      address: "test",
      countryId: 61,
      latitude: latitude,
      longitude: longitude,
    }

    console.log("Marker moved to:" + longitude + ", " + latitude);
    this.answerForm.controls.locationAnswer.setValue(location);
    this.answerForm.controls.locationAnswer.markAsTouched();
    
  }
}
