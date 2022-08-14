import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EvalLogicPipe} from "./form-answer/eval-logic.pipe";
import {FormAnswerComponent} from "./form-answer/form-answer.component";
import {
    DropDownBuildingComponentComponent
} from "./building-components/drop-down-building-component/drop-down-building-component.component";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
      EvalLogicPipe,
    FormAnswerComponent,
      DropDownBuildingComponentComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
  exports: [FormAnswerComponent],
})
export class FormBuilderModule { }
