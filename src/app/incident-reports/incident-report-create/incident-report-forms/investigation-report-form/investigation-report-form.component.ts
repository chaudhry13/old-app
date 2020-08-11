import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Division } from 'src/app/_models/division';
import { DivisionService } from 'src/app/_services/division.service';
import { CountryService } from 'src/app/_services/country.service';
import { Country } from 'src/app/_models/country';
import { IncidentType } from 'src/app/_models/incident-type';
import { IncidentCategory } from 'src/app/_models/incident-category';
import { IncidentCategoryService } from 'src/app/_services/incident-category.service';
import { LocationViewModel } from 'src/app/_models/location';
import { ModalController } from '@ionic/angular';
import { LocationModalPage } from 'src/app/modals/location-modal.page';
import { GeocodingService } from 'src/app/_services/geocoding.service';
import { ToastService } from 'src/app/_services/toast.service';
import { Location } from '@angular/common';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationService } from 'src/app/_services/location.service';

@Component({
  selector: 'investigation-report-form',
  templateUrl: './investigation-report-form.component.html',
  styleUrls: ['./investigation-report-form.component.scss']
})
export class InvestigationReportFormComponent implements OnInit {

  @Input() incidentForm: FormGroup;
  @Output() submissionEvent = new EventEmitter();

  public divisions: Division[];
  public countries: Country[];
  public incidentTypes: IncidentType[];
  public incidentCategories: IncidentCategory[];

  public currentIncidentCategory: IncidentCategory;
  public currentIncidentType: IncidentType;
  public currentLocation: LocationViewModel;
  public currentCountry: Country;

  constructor(
    private divisionService: DivisionService,
    private countryService: CountryService,
    private incidentCategoryService: IncidentCategoryService,
    public locationService: LocationService) { }

  ngOnInit() {
    this.getDataToPopulateForm();
    this.subscribeToIncidentTypeChange();
  }

  public submitForm() {

  }

  private getDataToPopulateForm() {
    this.listDivisions();
    this.listCountries();
    this.listIncidentTypesAndCategories();
  }

  private listDivisions(): void {
    this.divisionService.list().then(divisions => {
      this.divisions = divisions;
    });
  }

  private listCountries(): void {
    this.countryService.list().subscribe(countries => {
      this.countries = countries;
      this.locationService.getUserLocation().then(location => {
        console.log(location)
        this.locationService.populateFormWithLocation(this.incidentForm, location);
      });
    });
  }

  private listIncidentTypesAndCategories(): void {
    this.incidentTypes = [];
    this.incidentCategoryService.list(true).then(data => {
      this.incidentCategories = data;
      this.incidentTypes = this.incidentCategoryService.listIncidentTypes(data);
    });
  }

  private subscribeToIncidentTypeChange() {
    this.incidentForm.controls["incidentTypeId"].valueChanges.subscribe(incidentTypeid => {
      var incidentType: IncidentType = this.incidentTypes.find(i => i.id == incidentTypeid);
      this.currentIncidentCategory = this.incidentCategoryService.getIncidentCategoryFrom(incidentType, this.incidentCategories);
      this.incidentForm.controls["incidentCategoryId"].setValue(this.currentIncidentCategory.id);
    });
  }

  public showLocationModal() {
    this.locationService.showLocationModal().then(location => {
      console.log(location);
      this.locationService.populateFormWithLocation(this.incidentForm, location);
    })
  }
}
