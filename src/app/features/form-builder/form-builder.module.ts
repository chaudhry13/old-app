import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EvalLogicPipe} from "./form-answer/eval-logic.pipe";
import {FormAnswerComponent} from "./form-answer/form-answer.component";
import {
    DropDownBuildingComponentComponent
} from "./building-components/drop-down-building-component/drop-down-building-component.component";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "@shared/shared.module";


@NgModule({
  declarations: [
      EvalLogicPipe,
    FormAnswerComponent,
      DropDownBuildingComponentComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule
    ],
  exports: [FormAnswerComponent],
})
export class FormBuilderModule { }
