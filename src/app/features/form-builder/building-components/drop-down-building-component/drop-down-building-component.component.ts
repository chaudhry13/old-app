import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor, FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR, ValidationErrors,
  Validator, Validators
} from "@angular/forms";
import {
  DropDownBuildingComponent,
  DropDownListItem
} from "../../models/building-components/dropdown-building-component";
import {Subject} from "rxjs";
import {map, takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-drop-down-building-component',
  templateUrl: './drop-down-building-component.component.html',
  styleUrls: ['./drop-down-building-component.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropDownBuildingComponentComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DropDownBuildingComponentComponent),
      multi: true,
    },
  ],
})
export class DropDownBuildingComponentComponent implements ControlValueAccessor, Validator {
  @Input() viewOnly: boolean = false;

  textDropDownComponent: FormGroup;
  options: DropDownListItem[] = [];

  // Need to use a seperate control to handle dropdown options being a string[] or string. If we use main form, it doesnt work.
  testControl: FormControl = this.formBuilder.control(null);

  private unsub$ = new Subject();

  constructor(private formBuilder: FormBuilder) {
    this.textDropDownComponent = this.formBuilder.group({
      ...new DropDownBuildingComponent(),
      dropDownOptions: formBuilder.group({
        clearable: null,
        multiple: null,
        options: null,
        value: { value: '', disabled: false },
      }),
    });
  }
  ngOnInit(): void {
    if (this.viewOnly) {
      this.testControl.disable({ emitEvent: false });
    }
  }
  // if the parent sets this to required, then we run the custom validator
  validate(control: AbstractControl): ValidationErrors {
    const isValid = typeof this.testControl.value === 'object' ? this.testControl.value?.length > 0 : this.testControl.value !== null;

    return !isValid && control.hasValidator(Validators.required)
        ? { invalidForm: { valid: false, message: 'dropdownoptions value is required' } }
        : null;
  }

  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  writeValue(obj: DropDownBuildingComponent): void {
    if(!obj) return;
    const mapp = obj.dropDownOptions.multiple
        ? (<string>obj.dropDownOptions.value)?.split(',') || []
        : obj.dropDownOptions.value || null;


    this.testControl.setValue(mapp , { emitEvent: false });
    this.textDropDownComponent.patchValue(obj, { emitEvent: false });
    this.options = obj.dropDownOptions?.options ?? [];
    this.options = this.options.slice(0); // Trigger change detection
  }

  registerOnChange(fn: any): void {
    this.testControl.valueChanges
        .pipe(
            map(x => {
              const mapp = this.textDropDownComponent.value.dropDownOptions.multiple
                  ? x.join(',')  || null
                  : x || null;
              return {
                ...this.textDropDownComponent.value,
                dropDownOptions: { ...this.textDropDownComponent.value.dropDownOptions, value: mapp },
              };
            }),
            takeUntil(this.unsub$)
        )
        .subscribe(fn);
  }

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) this.textDropDownComponent.disable({ emitEvent: false });
    else this.textDropDownComponent.enable({ emitEvent: false });
  }
}