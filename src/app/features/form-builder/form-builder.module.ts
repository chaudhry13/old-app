import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EvalLogicPipe} from "./form-answer/eval-logic.pipe";
import {FormAnswerComponent} from "./form-answer/form-answer.component";
import {
    DropDownBuildingComponentComponent
} from "./building-components/drop-down-building-component/drop-down-building-component.component";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "@shared/shared.module";
import {IonicModule} from "@ionic/angular";
import {DropdownViewComponent} from "./dropdown-view.component";


@NgModule({
  declarations: [
      EvalLogicPipe,
    FormAnswerComponent,
      DropDownBuildingComponentComponent,
      DropdownViewComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        IonicModule
    ],
    exports: [FormAnswerComponent, DropdownViewComponent],
})
export class FormBuilderModule { }
