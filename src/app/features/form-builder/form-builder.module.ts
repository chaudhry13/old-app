import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EvalLogicPipe} from "./form-answer/eval-logic.pipe";
import {FormAnswerComponent} from "./form-answer/form-answer.component";


@NgModule({
  declarations: [
      EvalLogicPipe,
    FormAnswerComponent,
  ],
  imports: [
      CommonModule
  ],
  exports: [FormAnswerComponent],
})
export class FormBuilderModule { }
