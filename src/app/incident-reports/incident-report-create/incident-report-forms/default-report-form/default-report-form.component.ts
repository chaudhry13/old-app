import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController, ToastController } from '@ionic/angular';
import { LocationModalPage } from 'src/app/modals/location-modal.page';
import { Country } from 'src/app/_models/country';
import { Division } from 'src/app/_models/division';
import { IncidentCategory } from 'src/app/_models/incident-category';
import { IncidentType } from 'src/app/_models/incident-type';
import { CountryService } from 'src/app/_services/country.service';
import { DivisionService } from 'src/app/_services/division.service';
import { GeocodingService } from 'src/app/_services/geocoding.service';
import { IncidentCategoryService } from 'src/app/_services/incident-category.service';
import { ToastService } from 'src/app/_services/toast.service';
import { LocationService } from 'src/app/_services/location.service';

@Component({
  selector: 'default-report-form',
  templateUrl: './default-report-form.component.html',
  styleUrls: ['./default-report-form.component.scss']
})
export class DefaultReportFormComponent implements OnInit {
  @Input() incidentForm: FormGroup;
  @Output() submissionEvent = new EventEmitter();

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
    public divisionService: DivisionService,
    public countryService: CountryService,
    public incidentCategoryService: IncidentCategoryService,
    private locationService: LocationService) { }

  ngOnInit() {
    this.handleUserLocation();
    this.subscribeToCategoryChanges();
  }

  private subscribeToCategoryChanges() {
    this.incidentForm.controls["incidentCategoryId"].valueChanges.subscribe(categoryId => {
      if (categoryId == 7) {
        this.healthAndSafety = true;
      } else {
        this.healthAndSafety = false;
      }
    });
  }

  public showLocationModal() {
    this.locationService.showLocationModal().then(location => {
      this.locationService.populateFormWithLocation(this.incidentForm, location);
    })
  }

  private handleUserLocation(): void {
    this.countryService.list().subscribe(countries => {
      this.countries = countries;
      this.locationService.getUserLocation().then(location => {
        this.locationService.populateFormWithLocation(this.incidentForm, location);
      });
    });
  }

}
