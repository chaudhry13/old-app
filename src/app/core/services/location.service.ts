import { Injectable } from "@angular/core";
import { LocationViewModel } from "../models/location";
import { GeocodingService } from "./geocoding.service";
import { ToastService } from "./toast.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { ModalController } from "@ionic/angular";
import { LocationModalPage } from "@shared/components/location-modal/location-modal.page";
import { FormGroup } from "@angular/forms";
import { CountryService } from "@shared/services/country.service";

@Injectable({
  providedIn: "root",
})
export class LocationService {
  constructor(
    private geocodeService: GeocodingService,
    private toastService: ToastService,
    private geolocation: Geolocation,
    private modalController: ModalController,
    private countryService: CountryService
  ) {}

  public async getLocationFromLongLat(
    latitude: number,
    longitude: number
  ): Promise<LocationViewModel> {
    return new Promise<LocationViewModel>((resolve, reject) => {
      this.geocodeService
        .reverseGeocode(latitude, longitude)
        .then((data) => {
          let model = this.geocodeService.geocodeResult(data.results);
          resolve(new LocationViewModel(model));
        })
        .catch((error) => {
          console.error(error);
          reject();
        });
    });
  }

  public async getUserLocation(): Promise<LocationViewModel> {
    this.toastService.show("Finding your location...");
    return new Promise<LocationViewModel>((resolve, reject) => {
      this.geolocation
        .getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        })
        .then((position) => {
          this.toastService.show("Location found!");
          let location = this.getLocationFromLongLat(
            position.coords.latitude,
            position.coords.longitude
          );
          resolve(location);
        })
        .catch((error) => {
          this.toastService.show(
            "We couldn't find any locations based on your position"
          );
          resolve(this.getLocationFromLongLat(56.0956628, 9.9716147));
        });
    });
  }

  public async showLocationModal(): Promise<LocationViewModel> {
    return new Promise<LocationViewModel>(async (resolve, reject) => {
      let location;

      const modal = await this.modalController.create({
        component: LocationModalPage,
      });

      await modal.present();
      const { data } = await modal.onWillDismiss();

      if (data != null) {
        this.geocodeService
          .geocode(data)
          .then((data) => {
            let model = this.geocodeService.geocodeResult(data.results);
            location = new LocationViewModel(model);
            resolve(location);
          })
          .catch((error) => {
            this.toastService.show("Your location could not be found!");
            reject();
          });
      }
    });
  }

  public async populateFormWithLocation(
    form: FormGroup,
    location: LocationViewModel
  ): Promise<void> {
    form.controls.address.setValue(location.address);
    form.controls.city.setValue(location.city);
    form.controls.countryId.setValue(
      await this.getCountryIdFromCode(location.country)
    );
    form.controls.latitude.setValue(location.latitude);
    form.controls.longitude.setValue(location.longitude);
  }

  private getCountryIdFromCode(countryCode): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.countryService.list().subscribe((countries) => {
        resolve(countries.find((c) => c.code == countryCode).id.toString());
      });
    });
  }
}
