import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {
  AbstractControl, ControlValueAccessor,
  FormBuilder, FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors, Validator, Validators
} from "@angular/forms";
import {DateBuildingComponent, DateOptions} from "../../models/building-components/date-buliding-component";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-date-building-component',
  templateUrl: './date-building-component.component.html',
  styleUrls: ['./date-building-component.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateBuildingComponentComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: DateBuildingComponentComponent,
      multi: true,
    },
  ],
})
export class DateBuildingComponentComponent implements ControlValueAccessor, Validator {
  @Input() viewOnly: boolean = false;

  public inputDate: Date;
  dateComponent: FormGroup;
  public isRequired = false;

  private unsub$ = new Subject();

  get options() {
    return this.dateComponent.get('dateOptions') as FormGroup;
  }
  get value(){
    return this.options.controls.value as FormControl;
  }

  constructor(private formBuilder: FormBuilder) {
    this.dateComponent = this.formBuilder.group({
      ...new DateBuildingComponent(),
      dateOptions: formBuilder.group({
        value: null,
      } as DateOptions),
    } as DateBuildingComponent);
  }

  validate(control: AbstractControl): ValidationErrors {
    const isValid = this.options.get('value').value;
    this.isRequired = control.hasValidator(Validators.required);
    return !isValid && control.hasValidator(Validators.required) ? { invalidForm: {valid: false, message: "dateOptions value is required"} } : null;
  }

  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  writeValue(obj: DateBuildingComponent): void {
    if(!obj) return;
    this.inputDate = obj.dateOptions?.value != null ? new Date(obj.dateOptions.value) : new Date();
    this.dateComponent.patchValue(obj, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.dateComponent.valueChanges.pipe(takeUntil(this.unsub$)).subscribe(fn);
  }

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) this.dateComponent.disable({ emitEvent: false });
    else this.dateComponent.enable({ emitEvent: false });
  }

  valueChanges(value: Date) {
    this.options.controls.value.setValue(value);
  }
}
