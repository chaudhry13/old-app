import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuditPage } from "./pages/audit-page/audit.page";
import {SharedModule} from "@shared/shared.module";
import {AgmCoreModule} from "@agm/core";
import {AuditRoutingModule} from "./audit-routing.module";
import {AuditCompletePage} from "./pages/audit-complete/audit-complete.page";
import {AuditQrPage} from "./pages/audit-qrscanner/audit-qr.page";
import {AuditDetailsPage} from "./pages/audit-details/audit-details.page";
import {AuditQuestionnairePage} from "./pages/audit-questionnaire/audit-questionnaire.page";
import {QuestionComponent} from "./components/question/question.component";
import {QuestionGroupComponent} from "./components/question-group/question-group.component";
import {RadioQuestionComponent} from "./components/radio-question/radio-question.component";
import {SliderQuestionComponent} from "./components/slider-question/slider-question.component";
import {TextQuestionComponent} from "./components/text-question/text-question.component";
import {CheckboxQuestionComponent} from "./components/checkbox-question/checkbox-question.component";
import {LocationQuestionComponent} from "./components/location-question/location-question.component";
import {NumberQuestionComponent} from "./components/number-question/number-question.component";
import {AuditService} from "./services/audit.service";
import {ControlService} from "./services/control.service";
import {FollowUpService} from "./services/follow-up.service";
import {QuestionAnsweredService, QuestionnaireService, QuestionnaireUserAnswerService} from "./services/questionnaire.service";
import {QuestionnaireHelperService} from "./services/questionnaire-helper.service";
import {DivisionService} from "@app/services/division.service";
import {StorageService} from "@app/services/storage.service";
import {CameraService} from "@app/services/photo.service";
import {ToastService} from "@app/services/toast.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import {TokenService} from '@app/services/token.service';
import {UserService} from '@app/services/user.service';
import {ValidationService} from './services/validation.service';

@NgModule({
  imports: [
      IonicModule,
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      AuditRoutingModule,
      AgmCoreModule.forRoot({
        apiKey: "AIzaSyAXqcs7go3XxPZarCGTcSJxm_OU7ClN3Q0",
        libraries: ["places"]
      }),
      SharedModule
  ],
  declarations: [
      AuditPage,
      AuditCompletePage,
      AuditQrPage,
      AuditDetailsPage,
      AuditQuestionnairePage,
      QuestionComponent,
      QuestionGroupComponent,
      RadioQuestionComponent,
      SliderQuestionComponent,
      TextQuestionComponent,
      CheckboxQuestionComponent,
      LocationQuestionComponent,
      NumberQuestionComponent
  ],
    providers: [
        AuditService,
        ControlService,
        DivisionService,
        FollowUpService,
        QuestionnaireService,
        QuestionnaireHelperService,
        QuestionAnsweredService,
        QuestionnaireUserAnswerService,
    ]
})
export class AuditModule { }
