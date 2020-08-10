import { ErrorMessageComponent } from './../../_shared/error-message/error-message.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AuditQuestionnairePage } from './audit-questionnaire.page';
import { QuestionGroupComponent } from './question-group/question-group.component';
import { QuestionComponent } from './question/question.component';
import { TextQuestionComponent } from './text-question/text-question.component';
import { SliderQuestionComponent } from './slider-question/slider-question.component';
import { RadioQuestionComponent } from './radio-question/radio-question.component';
import { CheckboxQuestionComponent } from './checkbox-question/checkbox-question.component';
import { NumberQuestionComponent } from './number-question/number-question.component';
import { LocationQuestionComponent } from './location-question/location-question.component';
import { AgmCoreModule } from '@agm/core';
import { LocationSearchbarComponent } from 'src/app/_shared/location-searchbar/location-searchbar.component';


const routes: Routes = [
  {
    path: '',
    component: AuditQuestionnairePage
  }
];

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAXqcs7go3XxPZarCGTcSJxm_OU7ClN3Q0",
      libraries: ["places"]
    })
  ],
  declarations: [
    AuditQuestionnairePage,
    QuestionGroupComponent,
    QuestionComponent,
    TextQuestionComponent,
    SliderQuestionComponent,
    RadioQuestionComponent,
    CheckboxQuestionComponent,
    NumberQuestionComponent,
    LocationQuestionComponent,
    ErrorMessageComponent,
    LocationSearchbarComponent
  ],
  exports: [QuestionGroupComponent, QuestionComponent]
})
export class AuditQuestionnairePageModule { }
