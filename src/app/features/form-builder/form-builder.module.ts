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
import {DropdownViewComponent} from "./form-answer-view/views/dropdown-view.component";
import {
    TextBuildingComponentComponent
} from "./building-components/text-building-component/text-building-component.component";
import {
    TextAreaBuildingComponentComponent
} from "./building-components/text-area-building-component/text-area-building-component.component";
import {
    DateBuildingComponentComponent
} from "./building-components/date-building-component/date-building-component.component";
import {
    NumberBuildingComponentComponent
} from "./building-components/number-building-component/number-building-component.component";
import {
    LocationBuildingComponentComponent
} from "./building-components/location-building-component/location-building-component.component";
import {FormAnswerViewComponent} from "./form-answer-view/form-answer-view.component";
import {ParseViewComponent} from "./form-answer-view/views/parse-view.component";
import {AgmCoreModule} from "@agm/core";
import {LocationViewComponent} from "./form-answer-view/views/location-view.component";


@NgModule({
  declarations: [
      EvalLogicPipe,
      FormAnswerComponent,
      DropDownBuildingComponentComponent,
      DropdownViewComponent,
      TextBuildingComponentComponent,
      TextAreaBuildingComponentComponent,
      DateBuildingComponentComponent,
      NumberBuildingComponentComponent,
      LocationBuildingComponentComponent,
      FormAnswerViewComponent,
      ParseViewComponent,
      LocationViewComponent,

  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        IonicModule,
        AgmCoreModule
    ],
    exports: [FormAnswerComponent, DropdownViewComponent, FormAnswerViewComponent],
})
export class FormBuilderModule { }
