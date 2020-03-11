import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AuditQuestionnairePage } from './audit-questionnaire.page';
import { QuestionGroupComponent } from './question-group/question-group.component';
import { QuestionComponent } from './question/question.component';


const routes: Routes = [
  {
    path: '',
    component: AuditQuestionnairePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AuditQuestionnairePage, QuestionGroupComponent, QuestionComponent],
  exports: [QuestionGroupComponent, QuestionComponent]
})
export class AuditQuestionnairePageModule { }
