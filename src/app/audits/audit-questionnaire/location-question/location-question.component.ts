import { Component, OnInit, ViewChild, Input, NgZone } from "@angular/core";
import { Location, GeocodingAddress, LocationViewModel } from 'src/app/_models/location';
import { AgmMap, AgmMarker } from "@agm/core";
import { Question, QuestionnaireUserAnswer, QuestionAnsweres, QuestionLocationAnswer, QuestionLocationAnswerCreate } from 'src/app/_models/questionnaire';
import { FormGroup } from '@angular/forms';
import { GeocodingService } from 'src/app/_services/geocoding.service';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { CountryService } from 'src/app/_services/country.service';
import { Country } from 'src/app/_models/country';
import { ModalController, ToastController } from '@ionic/angular';
import { LocationModalPage } from 'src/app/modals/location-modal.page';
import { ToastService } from 'src/app/_services/toast.service';

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

  public location: LocationViewModel;

  public countries: Country[];

  // TODO: GENERAL:
  // - Implement places api to search for addresses and relocate the pin to get the address (2-way with addresses)
  // - If no question answer exists yet, we should use the users current location (default one, if the dont allow it)

  constructor(
    public geocodingService: GeocodingService,
    public geolocation: Geolocation,
    public countryService: CountryService,
    public modalController: ModalController,
    public toastService: ToastService) {
  }

  ngOnInit() {
    this.listCountries().then(countries => {
      this.countries = countries;

      if (this.questionAnswer != null && this.questionAnswer.locationAnswer != null) {
        console.log(this.questionAnswer);
        this.setNewPosition(this.questionAnswer.locationAnswer.longitude, this.questionAnswer.locationAnswer.latitude);

        var location = this.generateLocationAnswerObject();

        this.answerForm.controls.locationAnswer.setValue(location);

        this.renderMap = true;
      } else {
        this.getUserLocation();
      }
    })


  }

  private generateLocationAnswerObject() {
    var location = new QuestionLocationAnswerCreate();
    location.address = this.questionAnswer.locationAnswer?.address;
    location.countryId = this.questionAnswer.locationAnswer?.country.id;
    location.latitude = this.questionAnswer.locationAnswer?.latitude;
    location.longitude = this.questionAnswer.locationAnswer?.longitude;
    return location;
  }

  private setLocation(long: number, lat: number) {
    this.longitude = long;
    this.latitude = lat;
  }

  private async listCountries() {
    return this.countryService.list().toPromise();
  }

  onMarkerDragEnd(positionData) {
    this.setNewPosition(positionData.coords.lng, positionData.coords.lat);
  }

  setNewPosition(long: number, lat: number) {
    this.setLocation(long, lat);

    this.geocodingService
      .reverseGeocode(this.latitude, this.longitude)
      .then(data => {
        var model = this.geocodingService.geocodeResult(data.results);

        var location = {
          address: model.street + " " + model.street_number,
          countryId: this.getCountryid(model),
          latitude: this.latitude,
          longitude: this.longitude,
        }

        this.populateLocationViewModel(model);

        this.answerForm.controls.locationAnswer.setValue(location);
        this.answerForm.controls.locationAnswer.markAsTouched();
      })
      .catch(error => {
        console.log(error);
      });
  }

  populateLocationViewModel(model: GeocodingAddress) {
    this.location = new LocationViewModel(model);
  }

  private getCountryid(model: GeocodingAddress) {
    return this.countries.find(c => c.code == model.country)?.id;
  }

  getUserLocation() {
    this.geolocation
      .getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      })
      .then((position) => {
        this.setNewPosition(position.coords.longitude, position.coords.latitude);
        this.renderMap = true;
      })
      .catch((error) => {
        this.setNewPosition(9.9716147, 56.0956628);
        this.renderMap = true;
      });
  }

  async showLocationModal() {
    const modal = await this.modalController.create({
      component: LocationModalPage
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data != null) {
      this.geocodingService
        .geocode(data)
        .then(data => {
          var model = this.geocodingService.geocodeResult(data.results);
          this.setNewPosition(model.longitude, model.latitude);
        })
        .catch(error => {
          this.toastService.show("Your location could not be found!");
        });
    }
  }
}
