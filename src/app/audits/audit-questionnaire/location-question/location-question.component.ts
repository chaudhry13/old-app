import { Component, OnInit, ViewChild, Input, NgZone } from "@angular/core";
import { Location, GeocodingAddress } from 'src/app/_models/location';
import { AgmMap, AgmMarker } from "@agm/core";
import { Question, QuestionnaireUserAnswer, QuestionAnsweres, QuestionLocationAnswer, QuestionLocationAnswerCreate } from 'src/app/_models/questionnaire';
import { FormGroup } from '@angular/forms';
import { GeocodingService } from 'src/app/_services/geocoding.service';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { CountryService } from 'src/app/_services/country.service';
import { Country } from 'src/app/_models/country';

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

  renderMap: boolean = false;

  public longitude: number;
  public latitude: number;

  public countries: Country[];

  // TODO: GENERAL:
  // - Implement places api to search for addresses and relocate the pin to get the address (2-way with addresses)
  // - If no question answer exists yet, we should use the users current location (default one, if the dont allow it)

  constructor(
    public geocodingService: GeocodingService,
    public geolocation: Geolocation,
    public countryService: CountryService,
    public ngZone: NgZone) {
  }

  ngOnInit() {
    this.countryService.list().subscribe(countries => {
      this.countries = countries;
    });

    if (this.questionAnswer != null) {
      var location = new QuestionLocationAnswerCreate();
      location.address = this.questionAnswer.locationAnswer?.address;
      location.countryId = this.questionAnswer.locationAnswer?.country.id;
      location.latitude = this.questionAnswer.locationAnswer?.latitude;
      location.longitude = this.questionAnswer.locationAnswer?.longitude;

      this.latitude = this.questionAnswer.locationAnswer.latitude;
      this.longitude = this.questionAnswer.locationAnswer.longitude;
      console.log("from init: " + this.longitude + ", " + this.latitude);
      this.answerForm.controls.locationAnswer.setValue(location);
      this.renderMap = true;
    } else {
      this.getUserLocation();
    }

  }

  setNewPosition(longitude, latitude, coords) {
    this.ngZone.run(() => {
      this.geocodingService
        .reverseGeocode(this.myMap.latitude, this.myMap.longitude)
        .then(data => {
          var model = this.geocodingService.geocodeResult(data.results);

          var location = {
            address: model.street + " " + model.street_number,
            countryId: this.getCountryid(model),
            latitude: model.latitude,
            longitude: model.longitude,
          }

          this.answerForm.controls.locationAnswer.setValue(location);
          this.answerForm.controls.locationAnswer.markAsTouched();
        })
        .catch(error => {
          console.log(error);
        });
    });
  }

  private getCountryid(model: GeocodingAddress) {
    return this.countries.find(c => c.code == model.country).id;
  }

  getUserLocation() {
    this.geolocation
      .getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      })
      .then((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        this.renderMap = true;
      })
      .catch((error) => {
        this.latitude = 56.0956628;
        this.longitude = 9.9716147;

        this.renderMap = true;
      });
  }
}
