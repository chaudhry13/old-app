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
import { ErrorMessageComponent } from 'src/app/_shared/error-message/error-message.component';
import { ValidationService } from 'src/app/_services/validation.service';
import { QuestionnaireHelperService } from 'src/app/_services/questionnaire-helper.service';
import { QuestionAnsweredService } from 'src/app/_services/questionnaire.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from 'src/app/app.component';
import { ToastService } from 'src/app/_services/toast.service';

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
                ErrorMessageComponent
            ],
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                IonicModule,
                RouterTestingModule
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
