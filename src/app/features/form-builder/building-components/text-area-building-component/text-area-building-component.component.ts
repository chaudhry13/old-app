import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder, FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator, Validators
} from "@angular/forms";
import {TextAreaBuildingComponent} from "../../models/building-components/text-area-buildingcomponent";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-text-area-building-component',
  templateUrl: './text-area-building-component.component.html',
  styleUrls: ['./text-area-building-component.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaBuildingComponentComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: TextAreaBuildingComponentComponent,
      multi: true,
    },
  ],
})
export class TextAreaBuildingComponentComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() viewOnly: boolean = false;

  textAreaComponent: FormGroup;
  public isRequired = false;

  private unsub$ = new Subject();

  get textAreaOptions(){
    return this.textAreaComponent.get('textAreaOptions') as FormGroup;
  }

  constructor(private formBuilder: FormBuilder) {
    this.textAreaComponent = this.formBuilder.group({
      ...new TextAreaBuildingComponent(),
      textAreaOptions: formBuilder.group( {
        value: {value: null, disabled: false},
      }),
    });
  }

  validate(control: AbstractControl): ValidationErrors {
    const isValid = this.textAreaComponent.get('textAreaOptions').get('value').value;
    this.isRequired = control.hasValidator(Validators.required);
    return !isValid && control.hasValidator(Validators.required) ? { invalidForm: {valid: false, message: "textAreaOptions value is required"} } : null;
  }

  ngOnInit(): void {
    if(this.viewOnly) {
      this.textAreaComponent.get('textAreaOptions').disable({ emitEvent: false });
    }
  }

  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  writeValue(obj: any): void {
    this.textAreaComponent.patchValue(obj, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.textAreaComponent.valueChanges.pipe(takeUntil(this.unsub$)).subscribe(fn);
  }

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) this.textAreaComponent.disable({ emitEvent: false });
    else this.textAreaComponent.enable({ emitEvent: false });
  }
}
