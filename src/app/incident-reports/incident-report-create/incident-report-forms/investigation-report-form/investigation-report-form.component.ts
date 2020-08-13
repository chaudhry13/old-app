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
import { LocationService } from 'src/app/_services/location.service';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'investigation-report-form',
  templateUrl: './investigation-report-form.component.html',
  styleUrls: ['./investigation-report-form.component.scss']
})
export class InvestigationReportFormComponent implements OnInit {

  @Input() incidentForm: FormGroup;
  @Output() submissionEvent = new EventEmitter();

  public users: User[];
  public divisions: Division[];
  public countries: Country[];

  public currentLocation: LocationViewModel;
  public currentCountry: Country;
  public currentDate: string = new Date().toISOString();

  constructor(
    private divisionService: DivisionService,
    private countryService: CountryService,
    public locationService: LocationService,
    private userService: UserService) { }

  ngOnInit() {
    this.getDataToPopulateForm();
  }

  onPersonsFormChanges(persons: FormArray) {
    this.incidentForm.get("persons").setValue(persons);
  }

  private getDataToPopulateForm() {
    this.getUsersFromDivisions();
    this.handleUserLocation();
  }

  private getUsersFromDivisions(): void {
    this.divisionService.list().then(divisions => {
      this.divisions = divisions;
      this.getUsers(divisions);
    });
  }

  private handleUserLocation(): void {
    this.countryService.list().subscribe(countries => {
      this.countries = countries;
      this.locationService.getUserLocation().then(location => {
        this.locationService.populateFormWithLocation(this.incidentForm, location);
      });
    });
  }

  private getUsers(divisions: Division[]) {
    this.userService.list(divisions.map(division => division.id), null).subscribe(users => {
      this.users = users;
    });
  }

  public showLocationModal() {
    this.locationService.showLocationModal().then(location => {
      this.locationService.populateFormWithLocation(this.incidentForm, location);
    })
  }
}
