import {Component, ElementRef, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors, Validator, Validators
} from "@angular/forms";
import {LocationBuildingComponent, LocationOptions} from "../../models/building-components/location-component";
import {ValidationService} from "../../../audits/services/validation.service";
import {takeUntil} from "rxjs/operators";
import {CountryService} from "@app/services/country.service";
import {Subject} from "rxjs";
import {Country} from "@shared/models/country";
import {LocationService} from "@app/services/location.service";


@Component({
  selector: 'app-location-building-component',
  templateUrl: './location-building-component.component.html',
  styleUrls: ['./location-building-component.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocationBuildingComponentComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: LocationBuildingComponentComponent,
      multi: true,
    },
  ],
})
export class LocationBuildingComponentComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() viewOnly: boolean = false;

  @Input() searchable: boolean = false;
  @Input() buttonType: string = "ion-item";


  locationComponent: FormGroup;

  get options() {
    return this.locationComponent.get('locationOptions') as FormGroup;
  }

  private unsub$ = new Subject();

  constructor(
      private formBuilder: FormBuilder,
      public validationService: ValidationService,
      private countryService: CountryService,
      private locationService: LocationService,
  ) {
    this.locationComponent = this.formBuilder.group({
      ...new LocationBuildingComponent(),
      locationOptions: formBuilder.group({
        address: null,
        city: null,
        latitude: null,
        longitude: null,
        countryId: null,
      } as LocationOptions),
    });
  }

  validate(control: AbstractControl): ValidationErrors {
    const locationOptions = this.options;
    const validLocation = locationOptions.get('latitude').value && locationOptions.get('longitude').value && locationOptions.get('address').value && locationOptions.get('city').value && locationOptions.get('countryId').value;

    return !validLocation && control.hasValidator(Validators.required) ? { invalidForm: {valid: false, message: "location values are required"} } : null;
  }

  public countries: Country[];
  selectedCountry: any;

  ngOnInit(): void {

    if(this.viewOnly) {
      this.locationComponent.get('locationOptions').disable({ emitEvent: false });
    }

    this.countryService.list().subscribe(countries => {
      this.countries = countries;
    });

  }

  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  writeValue(obj: LocationBuildingComponent): void {
    this.locationComponent.patchValue({...obj, locationOptions: {...obj.locationOptions, countryId: +obj.locationOptions.countryId}}, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.locationComponent.valueChanges.pipe(takeUntil(this.unsub$)).subscribe(fn);
  }

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) this.locationComponent.disable({ emitEvent: false });
    else this.locationComponent.enable({ emitEvent: false });
  }

  public showLocationModal() {
    this.locationService.showLocationModal().then((location) => {
      this.selectedCountry = location.country;
      this.locationService.populateFormWithLocation(
          this.options,
          location
      );
    });
  }

}