import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {
  AbstractControl, ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors, Validator, Validators
} from "@angular/forms";
import {NumberBuildingComponent} from "../../models/building-components/number-building-component";
import {Subject} from "rxjs";
import {ValidationService} from "../../../audits/services/validation.service";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-number-building-component',
  templateUrl: './number-building-component.component.html',
  styleUrls: ['./number-building-component.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberBuildingComponentComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NumberBuildingComponentComponent),
      multi: true,
    },
  ],
})
export class NumberBuildingComponentComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() viewOnly: boolean = false;

  numberGroup: FormGroup;
  public errorMsg = "";
  public isRequired = false;

  get numberOptions() {
    return this.numberGroup.get('numberOptions') as FormGroup;
  }

  private unsub$ = new Subject();

  constructor(private formBuilder: FormBuilder, public validationService: ValidationService) {
    this.numberGroup = this.formBuilder.group({
      ...new NumberBuildingComponent(),
      numberOptions: formBuilder.group({
        maxValue: null,
        minValue: null,
        value: { value: null, disabled: false },
      }),
    });
  }

  validate(control: AbstractControl): ValidationErrors {
    let isValid;
    const value = this.numberOptions.get('value').value;
    const minValue = this.numberOptions.get('minValue').value;
    const maxValue = this.numberOptions.get('maxValue').value;

    if(minValue != null && maxValue != null){
      isValid = value && value >= minValue && value <= maxValue;
      this.errorMsg = "The value must be between " + minValue.toString() + " and " + maxValue.toString();
    }
    else if (minValue != null && maxValue == null) {
      if(value == 0 && minValue <= 0) isValid = true;
      else isValid = value && value >= minValue;
      this.errorMsg = "The value must be greater than or equal to " + minValue.toString();
    }
    else if (minValue == null && maxValue != null) {
      if(value == 0 && maxValue >= 0) isValid = true;
      else isValid = value && value <= maxValue;
      this.errorMsg = "The value must be less than or equal to " + maxValue.toString();
    }
    else {
      isValid = value != null;
      this.errorMsg = "A number is required";
    }
    this.isRequired = control.hasValidator(Validators.required);

    return !isValid && control.hasValidator(Validators.required)
        ? { invalidForm: { valid: false, message: 'numberOptions value is required' } }
        : null;
  }

  ngOnInit(): void {
    if (this.viewOnly) {
      this.numberGroup.get('numberOptions').disable({ emitEvent: false });
    }
  }

  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  writeValue(obj: any): void {
    this.numberGroup.patchValue(obj, { emitEvent: false });
    this.numberOptions.controls.value.clearValidators();
    this.numberOptions.controls.value.addValidators(Validators.min(this.numberOptions.value.minValue));
    this.numberOptions.controls.value.addValidators(Validators.max(this.numberOptions.value.maxValue));
    this.numberOptions.controls.value.updateValueAndValidity({ emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.numberGroup.valueChanges.pipe(takeUntil(this.unsub$)).subscribe(fn);
  }

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) this.numberGroup.disable({ emitEvent: false });
    else this.numberGroup.enable({ emitEvent: false });
  }
}
