import { Component, OnInit, ViewChild, Input, NgZone } from "@angular/core";
import {
  Location,
  GeocodingAddress,
  LocationViewModel,
} from "@app/models/location";
import { AgmMap, AgmMarker } from "@agm/core";
import {
  Question,
  QuestionnaireUserAnswer,
  QuestionAnsweres,
  QuestionLocationAnswer,
  QuestionLocationAnswerCreate,
} from "../../models/questionnaire";
import { FormGroup } from "@angular/forms";
import { GeocodingService } from "@app/services/geocoding.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { CountryService } from "@app/services/country.service";
import { Country } from "@shared/models/country";
import { ModalController, ToastController } from "@ionic/angular";
import { LocationModalPage } from "@shared/components/location-modal/location-modal.page";
import { ToastService } from "@app/services/toast.service";

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

  constructor(
    public geocodingService: GeocodingService,
    public geolocation: Geolocation,
    public countryService: CountryService,
    public modalController: ModalController,
    public toastService: ToastService
  ) {}

  ngOnInit() {
    this.listCountries().then((countries) => {
      this.countries = countries;

      if (
        this.questionAnswer != null &&
        this.questionAnswer.locationAnswer != null
      ) {
        this.setNewPosition(
          this.questionAnswer.locationAnswer.longitude,
          this.questionAnswer.locationAnswer.latitude
        );

        var location = this.generateLocationAnswerObject();

        this.answerForm.controls.locationAnswer.setValue(location, { emitEvent: false });

        this.renderMap = true;
      } else {
        this.getUserLocation();
      }
    });
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
    this.setNewPosition(positionData.latLng.lng(), positionData.latLng.lat());
  }

  setNewPosition(long: number, lat: number) {
    this.setLocation(long, lat);

    this.geocodingService
      .reverseGeocode(this.latitude, this.longitude)
      .then((data) => {
        var model = this.geocodingService.geocodeResult(data.results);

        var location = {
          address: model.street + " " + model.street_number,
          countryId: this.getCountryid(model),
          latitude: this.latitude,
          longitude: this.longitude,
        };

        this.populateLocationViewModel(model);

        this.answerForm.controls.locationAnswer.setValue(location);
        this.answerForm.controls.locationAnswer.markAsTouched();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  populateLocationViewModel(model: GeocodingAddress) {
    this.location = new LocationViewModel(model);
  }

  private getCountryid(model: GeocodingAddress) {
    return this.countries.find((c) => c.code == model.country)?.id;
  }

  getUserLocation() {
    this.geolocation
      .getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      })
      .then((position) => {
        this.setNewPosition(
          position.coords.longitude,
          position.coords.latitude
        );
        this.renderMap = true;
      })
      .catch((error) => {
        this.setNewPosition(9.9716147, 56.0956628);
        this.renderMap = true;
      });
  }

  async showLocationModal() {
    const modal = await this.modalController.create({
      component: LocationModalPage,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data != null) {
      this.geocodingService
        .geocode(data)
        .then((data) => {
          var model = this.geocodingService.geocodeResult(data.results);
          this.setNewPosition(model.longitude, model.latitude);
        })
        .catch((error) => {
          this.toastService.show("Your location could not be found!");
        });
    }
  }
}
