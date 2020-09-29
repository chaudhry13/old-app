import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DivisionItemComponent} from "./components/division-item/division-item.component";
import {DivisionListComponent} from "./components/division-list/division-list.component";
import {DivisionSelectorComponent} from "./components/division-selector/division-selector.component";
import {DivisionSelectorModalPage} from "./components/division-selector-modal/division-selector-modal.page";
import {ErrorMessageComponent} from "./components/error-message/error-message.component";
import {LocationModalPage} from "./components/location-modal/location-modal.page";
import {LocationSearchbarComponent} from "./components/location-searchbar/location-searchbar.component";
import {RiskLevelPipe} from "@shared/pipes/risk-level.pipe";
import {SanitizeHtmlPipe} from "@shared/pipes/sanitazion.pipe";



@NgModule({
  declarations: [
      DivisionItemComponent,
      DivisionListComponent,
      DivisionSelectorComponent,
      DivisionSelectorModalPage,
      ErrorMessageComponent,
      LocationModalPage,
      LocationSearchbarComponent,
      RiskLevelPipe,
      SanitizeHtmlPipe
  ],
  imports: [
    CommonModule
  ],
    exports: [
        CommonModule,
        FormsModule,
        DivisionItemComponent,
        DivisionListComponent,
        DivisionSelectorComponent,
        DivisionSelectorModalPage,
        ErrorMessageComponent,
        LocationModalPage,
        LocationSearchbarComponent,
        RiskLevelPipe,
        SanitizeHtmlPipe
    ]
})
export class SharedModule { }
