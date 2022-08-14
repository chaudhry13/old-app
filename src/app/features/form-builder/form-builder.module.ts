import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EvalLogicPipe} from "./form-answer/eval-logic.pipe";



@NgModule({
  declarations: [
    EvalLogicPipe,
  ],
  imports: [
    CommonModule
  ]
})
export class FormBuilderModule { }
