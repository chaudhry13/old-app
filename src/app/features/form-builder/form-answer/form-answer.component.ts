import {ChangeDetectorRef, Component, forwardRef, Input, OnInit} from '@angular/core';
import {EvalLogicPipe} from "./eval-logic.pipe";
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR, ValidationErrors,
  Validator, Validators
} from "@angular/forms";
import {FormDto} from "../models/form.dto";
import {Subject} from "rxjs";
import {LogicHelperService} from "../services/logic-helper.service";
import {HrFormType} from "../models/hr-form";
import {takeUntil} from "rxjs/operators";
import {BuildingComponentType, BuildingComponentUnion} from "../models/building-components/building-component";

@Component({
  selector: 'app-form-answer',
  templateUrl: './form-answer.component.html',
  styleUrls: ['./form-answer.component.scss'],
  providers: [EvalLogicPipe, {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FormAnswerComponent),
    multi: true,
  },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FormAnswerComponent),
      multi: true,
    }],
})
export class FormAnswerComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() hideTitle = false;
  form: FormGroup;
  private formDto: FormDto;
  BuildingComponentType = BuildingComponentType;

  showDivisions = false;

  get allElements(): any[] {
    return this.formSections.controls.reduce((a, b: FormGroup) => {
      const arr = b.get('buildingComponents') as FormArray;
      return [...a, ...arr.value];
    }, []);
  }

  get formSections() {
    return this.form.get('formSections') as FormArray;
  }

  private unsub$ = new Subject();

  constructor(
      private fb: FormBuilder,
      private logicHelper: LogicHelperService,
      private displayLogicPipe: EvalLogicPipe,
      private readonly cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      id: [''],
      name: [''],
      divisionIds: [[], {disabled: true}],
      type: null,
      formSections: this.fb.array([
        this.fb.group({
          id: [''],
          name: [''],
          buildingComponents: this.fb.array([]),
        }),
      ]),
    });
  }

  validate(control: AbstractControl): ValidationErrors {
    return this.form.valid ? null : { invalidForm: true };
  }


  writeValue(formDto: FormDto): void {
    if(!formDto) return;

    this.formDto = formDto;
    this.form.patchValue({ id:formDto.id, name: formDto.name, type: formDto.type, divisionIds: formDto.divisionIds }, { emitEvent: false });
    if(this.formDto.type == HrFormType['Custom'])
    {
      this.showDivisions = true;
      this.form.get('divisionIds').enabled;
      // this.customFormSection.setValue(x ? x : null, { emitEvent: false });
      this.form.get('divisionIds').setValidators(Validators.required);
      this.form.updateValueAndValidity({ emitEvent: false });

    }
    this.fillForm();
    this.runDisplayLogic();
  }

  registerOnChange(fn: any): void {
    this.cdr.detectChanges(); // TODO: This line of code fixed an issue where validation didnt register in IncidentReportCreate
    this.form.valueChanges.pipe(takeUntil(this.unsub$)).subscribe(fn);
  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable({ emitEvent: false }) : this.form.enable({ emitEvent: false });
  }

  ngOnInit(): void {
    this.form.valueChanges.pipe(takeUntil(this.unsub$)).subscribe(x => {
      this.runDisplayLogic();

      //this.runAutofillLogic();
    });
  }

  ngAfterViewInit() {
    this.runDisplayLogic();
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }


  // private runAutofillLogic() {
  //   this.formSections.controls.forEach(section => {
  //     const buildingComponents: FormArray = section.get('buildingComponents') as FormArray;
  //     buildingComponents.controls.forEach(element => {
  //       if(element.value === null) return;
  //       const autofillLogic: AutofillLogic[] = element.value.autofillLogic ?? [];

  //       const fillValue = autofillLogic.reduce((acc, curr) => {
  //         const currentEvaluatedLogic = this.allElements.find(x => x.id === curr.selectedField);
  //         if (!currentEvaluatedLogic) return '';
  //         const logicSolver = this.logicHelper.logicSolverFactory(currentEvaluatedLogic.type);
  //         const shouldFill = logicSolver(curr, currentEvaluatedLogic);
  //         const valueToFill = curr.autofillValue;
  //         if (shouldFill) {
  //           acc = valueToFill;
  //         }
  //         return acc;
  //       }, '');

  //       const [key,dynamicOptions]: [string, OptionsUnion] = BuildingComponent.childFieldsFactory(element.value);
  //       const res = {...element.value};
  //       if (fillValue) {
  //         (<any>dynamicOptions).value = fillValue;
  //         res[key] = dynamicOptions;
  //       }

  //       element.setValue(res, { emitEvent: false, onlySelf: true });
  //     });
  //   });
  // }

  private runDisplayLogic() {
    const allBc: BuildingComponentUnion[] = this.formSections.value.reduce(
        (acc, section) => [...acc, ...section.buildingComponents],
        []
    );
    this.formDto.formSections.forEach((section, sectionIdx) => {
      const buildingComponents = section.buildingComponents;
      buildingComponents.forEach((bc, bcIdx) => {
        const shouldDisplay = this.displayLogicPipe.transform(bc, allBc);
        const currElement = (<FormArray>this.formSections.at(sectionIdx).get('buildingComponents')).at(bcIdx);
        const currDomElement = document.getElementById(`${bc.id}`);
        if(!currDomElement) return;
        if (shouldDisplay) {

          if(currDomElement.classList.contains('hidden')) {
            currDomElement.classList.remove('hidden');
            currElement.updateValueAndValidity({ emitEvent: true });
          }

        } else {
          if(!currDomElement.classList.contains('hidden')) {
            currDomElement.classList.add('hidden');
            currElement.updateValueAndValidity({ emitEvent: true });
          }
        }
      });
    });
  }

  private fillForm() {
    this.formSections.clear({ emitEvent: false });
    this.formDto.formSections.forEach(x => {
      this.formSections.push(
          this.fb.group({
            id: x.id,
            name: x.name,
            buildingComponents: this.fb.array(
                x.buildingComponents.map(x => this.fb.control(x, x.required ? Validators.required : null))
            ),
          })
          , { emitEvent: false });
    });
  }

  divisionsChanged(data) {
    if (data) {
      this.form.get("divisionIds").setValue(data);
    }
  }
}

