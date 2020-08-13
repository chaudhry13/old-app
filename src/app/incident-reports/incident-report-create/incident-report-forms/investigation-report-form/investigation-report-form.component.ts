import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
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
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/user';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'investigation-report-form',
  templateUrl: './investigation-report-form.component.html',
  styleUrls: ['./investigation-report-form.component.scss']
})
export class InvestigationReportFormComponent implements OnInit {

  @Input() incidentForm: FormGroup;
  @Output() submissionEvent = new EventEmitter();

  public divisions: Division[];
  public users: User[];
  public countries: Country[];
  public incidentTypes: IncidentType[];
  public incidentCategories: IncidentCategory[];

  public isIntelligenceReportSelected = false;

  public currentIncidentCategory: IncidentCategory;
  public currentIncidentType: IncidentType;
  public currentLocation: LocationViewModel;
  public currentCountry: Country;
  public currentDate: string = new Date().toISOString();

  constructor(
    private divisionService: DivisionService,
    private countryService: CountryService,
    private incidentCategoryService: IncidentCategoryService,
    public locationService: LocationService,
    private userService: UserService) { }

  ngOnInit() {
    this.getDataToPopulateForm();
    this.subscribeToIncidentTypeChange();
  }

  onPersonsFormChanges(persons: FormArray) {
    this.incidentForm.get("persons").setValue(persons);
  }

  private getDataToPopulateForm() {
    this.listDivisions();
    this.listCountries();
    this.listIncidentTypesAndCategories();
  }

  private listDivisions(): void {
    this.divisionService.list().then(divisions => {
      this.divisions = divisions;
      this.listUsersFromUserDivisions(divisions);
    });
  }

  private listCountries(): void {
    this.countryService.list().subscribe(countries => {
      this.countries = countries;
      this.locationService.getUserLocation().then(location => {
        this.locationService.populateFormWithLocation(this.incidentForm, location);
      });
    });
  }

  private listUsersFromUserDivisions(divisions: Division[]) {
    this.userService.list(divisions.map(division => division.id), null).subscribe(users => {
      this.users = users;
    });
  }

  private listIncidentTypesAndCategories(): void {
    this.incidentTypes = [];
    this.incidentCategoryService.list(true).then(data => {
      this.incidentCategories = data;

      // TODO: Remove this at some point before production
      this.addTestData();

      this.incidentTypes = this.incidentCategoryService.listIncidentTypes(data);
    });
  }


  private subscribeToIncidentTypeChange() {
    this.incidentForm.controls["incidentTypeId"].valueChanges.subscribe(incidentTypeid => {
      if (incidentTypeid) {
        var incidentType: IncidentType = this.incidentTypes.find(i => i.id == incidentTypeid);
        this.currentIncidentCategory = this.incidentCategoryService.getIncidentCategoryFrom(incidentType, this.incidentCategories);
        this.incidentForm.controls["incidentCategoryId"].setValue(this.currentIncidentCategory.id);
        this.isIntelligenceReportSelected = incidentType.name == "Intelligence Report";
      }
    });
  }

  public showLocationModal() {
    this.locationService.showLocationModal().then(location => {
      this.locationService.populateFormWithLocation(this.incidentForm, location);
    })
  }

  private addTestData() {
    var cat: IncidentCategory = {
      id: 1337,
      name: "Observation",
      incidentTypes: []
    };
    var type: IncidentType = {
      id: 1337,
      name: "Intelligence Report",
      incidentCategory: cat
    };

    cat.incidentTypes.push(type);
    this.incidentCategories.push(cat);
  }
}
