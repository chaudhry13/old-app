import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocationService } from 'src/app/_services/location.service';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { CountryService } from 'src/app/_services/country.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent implements OnInit {

  @Input() searchable: boolean = false;
  @Input() buttonType: string = "button";
  @Input() mainForm: FormGroup;

  locationForm: FormGroup;

  constructor(
    private locationService: LocationService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.locationForm = this.formBuilder.group({
      address: [""],
      city: [""],
      latitude: ["", Validators.required],
      longitude: ["", Validators.required],
      countryId: [""]
    });

    this.handleUserLocation();
    this.subscribeToFormChanges();
  }

  public showLocationModal() {
    this.locationService.showLocationModal().then(location => {
      this.locationService.populateFormWithLocation(this.locationForm, location);
    })
  }

  private handleUserLocation(): void {
    this.locationService.getUserLocation().then(location => {
      this.locationService.populateFormWithLocation(this.locationForm, location);
    });
  }

  private subscribeToFormChanges() {
    this.locationForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(location => {
        this.patchLocationValues(location);
      });
  }

  private patchLocationValues(location: FormGroup) {
    this.mainForm.patchValue(location);
  }
}
