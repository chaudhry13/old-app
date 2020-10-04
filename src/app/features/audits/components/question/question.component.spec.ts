import { QuestionComponent } from './question.component';
import { async, ComponentFixture, TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TextQuestionComponent } from '../text-question/text-question.component';
import { SliderQuestionComponent } from '../slider-question/slider-question.component';
import { RadioQuestionComponent } from '../radio-question/radio-question.component';
import { CheckboxQuestionComponent } from '../checkbox-question/checkbox-question.component';
import { NumberQuestionComponent } from '../number-question/number-question.component';
import { ErrorMessageComponent } from '@shared/components/error-message/error-message.component';
import { ValidationService } from '../../services/validation.service';
import { QuestionnaireHelperService } from '../../services/questionnaire-helper.service';
import { QuestionAnsweredService } from '../../services/questionnaire.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from 'src/app/app.component';
import { ToastService } from '@app/services/toast.service';
import { LocationQuestionComponent } from '../location-question/location-question.component';
import { AgmCoreModule, AgmMap, AgmMarker } from '@agm/core';

describe('QuestionComponent', () => {
    let component: QuestionComponent;
    let fixture: ComponentFixture<QuestionComponent>;
    let de: DebugElement;
    let validationService, questionnaireHelperService, questionAnsweredService, toastService;

    beforeEach(async(() => {
        validationService = jasmine.createSpyObj('ValidationService', ['isQuestionAnswerValid']);
        questionnaireHelperService = jasmine.createSpyObj('QuestionnaireHelperService', ['findQuestionAnswer', 'getQuestionAnswer', 'CheckOptionValue', 'updateAnswer']);
        questionAnsweredService = jasmine.createSpyObj('QuestionAnsweredService', ['insert', 'update', 'get']);
        toastService = jasmine.createSpyObj('ToastService', ['showWithDuration', 'show']);

        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                QuestionComponent,
                TextQuestionComponent,
                SliderQuestionComponent,
                RadioQuestionComponent,
                CheckboxQuestionComponent,
                NumberQuestionComponent,
                LocationQuestionComponent,
                ErrorMessageComponent,
            ],
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                IonicModule,
                RouterTestingModule,
                AgmCoreModule
            ],
            providers: [
                { provide: ValidationService, useValue: validationService },
                { provide: QuestionnaireHelperService, useValue: questionnaireHelperService },
                { provide: QuestionAnsweredService, useValue: questionAnsweredService },
                { provide: ToastService, useValue: toastService }
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(QuestionComponent);
        component = fixture.debugElement.componentInstance;
        expect(component).toBeTruthy();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
