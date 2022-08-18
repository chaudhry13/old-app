import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR, ValidationErrors,
  Validator, Validators
} from "@angular/forms";
import {Subject} from "rxjs";
import {TextBuildingComponent} from "../../models/building-components/text-building-component";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-text-building-component',
  templateUrl: './text-building-component.component.html',
  styleUrls: ['./text-building-component.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextBuildingComponentComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: TextBuildingComponentComponent,
      multi: true,
    },
  ],
})
export class TextBuildingComponentComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() viewOnly: boolean = false;

  textComponent: FormGroup;
  public isRequired = false;

  private unsub$ = new Subject();

  get textOptions(){
    return this.textComponent.get('textOptions') as FormGroup;
  }

  constructor(private formBuilder: FormBuilder) {
    this.textComponent = this.formBuilder.group({
      ...new TextBuildingComponent(),
      textOptions: formBuilder.group({
        value: {value: null,disabled: false},
      }),
    } as TextBuildingComponent);
  }

  validate(control: AbstractControl): ValidationErrors {
    const isValid = this.textComponent.get('textOptions').get('value').value;
    this.isRequired = control.hasValidator(Validators.required);
    return !isValid && control.hasValidator(Validators.required) ? { invalidForm: {valid: false, message: "textOptions value is required"} } : null;
  }

  ngOnInit(): void {
    if(this.viewOnly) {
      this.textComponent.get('textOptions').disable({ emitEvent: false });
    }
  }

  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  writeValue(obj: TextBuildingComponent): void {
    this.textComponent.patchValue(obj, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.textComponent.valueChanges.pipe(takeUntil(this.unsub$)).subscribe(fn);
  }

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) this.textComponent.disable({ emitEvent: false });
    else this.textComponent.enable({ emitEvent: false });
  }
}
