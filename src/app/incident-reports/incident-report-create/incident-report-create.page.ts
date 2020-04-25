import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Division } from 'src/app/_models/division';
import { DivisionService } from 'src/app/_services/division.service';
import { IncidentCategoryService } from 'src/app/_services/incident-category.service';
import { IncidentCategory } from 'src/app/_models/incident-category';
import { IncidentType } from 'src/app/_models/incident-type';
import { ModalController } from '@ionic/angular';
import { LocationModalPage } from 'src/app/modals/location-modal.page';
import { GeocodingService } from 'src/app/_services/geocoding.service';
import { ToastController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IncidentReportService } from 'src/app/_services/incident-report.service';
import { CountryService } from 'src/app/_services/country.service';
import { Country } from 'src/app/_models/country';

@Component({
  selector: 'app-incident-report-create',
  templateUrl: 'incident-report-create.page.html',
  styleUrls: ['./incident-report-create.page.scss']
})

export class IncidentReportCreatePage implements OnInit {
  public incidentForm: FormGroup;
  public divisions: Division[];
  public countries: Country[];
  public country: Country;
  public incidentCategories: IncidentCategory[];
  public incidentTypes: IncidentType[];

  public locationEnabled: boolean = true;
  public latitude = null;
  public longitude = null;

  public incidentCategory: IncidentCategory;

  public healthAndSafety: boolean;

  constructor(public activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private incidentReportService: IncidentReportService,
    public divisionService: DivisionService,
    public countryService: CountryService,
    public incidentCategoryService: IncidentCategoryService,
    private modalController: ModalController,
    private geocodeService: GeocodingService,
    private geolocation: Geolocation,
    private toastCtrl: ToastController) {
    this.incidentForm = this.formBuilder.group({
      description: ["", Validators.required],
      other: [""],
      nearMiss: [false],
      divisionIds: [null, Validators.required],
      address: [""],
      city: [""],
      startDate: [new Date().toISOString(), Validators.required],
      endDate: [new Date().toISOString(), Validators.required],
      latitude: ["", Validators.required],
      longitude: ["", Validators.required],
      incidentTypeId: [null, Validators.required],
      incidentCategoryId: [null, Validators.required],
      countryId: [""],
    });
  }

  ngOnInit() {
    // List divisions
    this.divisionService.list().then(divisions => {
      this.divisions = divisions;
    });

    // List countries
    this.countryService.list().subscribe(countries => {
      this.countries = countries;
    });

    // Subscribe on incidentType change
    this.onIncidentTypeChange();

    // List incident types
    this.incidentTypes = [];
    this.incidentCategoryService.list(true).then(data => {
      this.incidentCategories = data;
      data.forEach(cat => this.incidentTypes = cat.incidentTypes.concat(this.incidentTypes));

      // Sort incident types
      this.incidentTypes.sort(this.compareIncidentTypes);
    });

    // Subscribe on address change
    this.onAddressToggleChange();
  }

  onIncidentTypeChange() {
    this.incidentForm.controls["incidentTypeId"].valueChanges.subscribe(id => {
      var incidentType: IncidentType = this.incidentTypes.find(i => i.id == id);
      this.incidentCategory = this.getIncidentCategory(incidentType);
      this.incidentForm.controls["incidentCategoryId"].setValue(this.incidentCategory.id);
      if (this.incidentCategory.id == 7) {
        this.healthAndSafety = true;
      } else {
        this.healthAndSafety = false;
      }
    });
  }

  getIncidentCategory(incidentType: IncidentType): IncidentCategory {
    return this.incidentCategories.find(cat => cat.incidentTypes.includes(incidentType));
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  async showLocationModal() {
    const modal = await this.modalController.create({
      component: LocationModalPage
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data != null) {
      this.geocodeService
        .geocode(data)
        .then(data => {
          var model = this.geocodeService.geocodeResult(data.results);

          this.incidentForm.controls["address"].setValue(model.street + " " + model.street_number);
          this.incidentForm.controls["city"].setValue(model.city);
          this.country = this.countries.find(c => c.code == model.country);
          this.incidentForm.controls["countryId"].setValue(this.country.name);
          this.incidentForm.controls["latitude"].setValue(model.latitude);
          this.incidentForm.controls["longitude"].setValue(model.longitude);
        })
        .catch(error => {
          this.presentToast("Your location could not be found!");
        });
    }
  }

  onAddressToggleChange() {
    if (this.locationEnabled) {
      this.presentToast("Getting your location...");

      this.geolocation
        .getCurrentPosition({ enableHighAccuracy: true, timeout: 5000, maximumAge: 0 })
        .then(position => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;

          this.geocodeService
            .reverseGeocode(position.coords.latitude, position.coords.longitude)
            .then(data => {
              var model = this.geocodeService.geocodeResult(data.results);

              this.incidentForm.controls["address"].setValue(model.street + " " + model.street_number);
              this.incidentForm.controls["city"].setValue(model.city);
              this.country = this.countries.find(c => c.code == model.country);
              this.incidentForm.controls["countryId"].setValue(this.country.name);
              this.incidentForm.controls["latitude"].setValue(model.latitude);
              this.incidentForm.controls["longitude"].setValue(model.longitude);
            })
            .catch(error => {
              console.log(error);
              this.presentToast("We couldn't find any locations based on your position");
            });
        })
        .catch(error => {
          console.log(error);
          this.locationEnabled = false;
          this.presentToast("Your location could not be found!");
        });
    }
  }

  async submitForm() {
    if (this.incidentForm.valid) {
      this.incidentForm.controls["countryId"].setValue(this.country.id);
      this.incidentReportService.insert(this.incidentForm.value).then(id => {
        this.router.navigate(["/tabs/tab2/details/" + id + "/0"]).then(() => {
          this.presentToast("New incident report created!");
        });
      });
    }
  }

  compareIncidentTypes(a: IncidentType, b: IncidentType) {
    if (a.name.includes("Other")) {
      return 1;
    } else if (b.name.includes("Other")) {
      return -1;
    }
    return (a.name > b.name ? 1 : -1);
  }
}