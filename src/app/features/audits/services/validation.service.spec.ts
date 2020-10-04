import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { QuestionnaireHelperService } from './questionnaire-helper.service';
import { QuestionAnsweredService } from './questionnaire.service';
import { ToastService } from '@app/services/toast.service';
import { Question, QuestionTypes, QuestionTextOptions, QuestionTextType } from '../models/questionnaire';
import { not } from '@angular/compiler/src/output/output_ast';

describe('ValidationService', () => {
    let validationService: ValidationService;
    describe("Validation of questions", () => {
        let formBuilder, answerForm, requiredQuestion, notRequiredQuestion;
        beforeEach(async(() => {
            validationService = new ValidationService();
            formBuilder = new FormBuilder();

            requiredQuestion = new Question();
            requiredQuestion.id = "1234";
            requiredQuestion.title = "This is a test question";
            requiredQuestion.type = QuestionTypes.Text;
            requiredQuestion.index = 1;
            requiredQuestion.weight = 100;
            requiredQuestion.archived = false;
            requiredQuestion.required = true;
            let textOptions = new QuestionTextOptions()
            textOptions.regex = "";
            textOptions.type = QuestionTextType["Free Text"];
            requiredQuestion.textOptions = textOptions;
            requiredQuestion.possibleAnswers = [];
            requiredQuestion.answeres = [];

            notRequiredQuestion = Object.create(requiredQuestion);
            notRequiredQuestion.required = false;

            answerForm = formBuilder.group({
                id: [''],
                questionId: [''],
                userAnswerId: [''],
                text: [''],
                slider: [0],
                numberAnswer: [0],
                comment: [''],
                na: [false],
                answered: [false]
            });

            TestBed.configureTestingModule({
                declarations: [

                ],
                imports: [
                    CommonModule,
                    FormsModule,
                    ReactiveFormsModule,
                    IonicModule,
                    RouterTestingModule
                ],
                providers: [
                    { provide: FormBuilder, useValue: formBuilder },
                ],
            }).compileComponents();
        }));

        it('should initialize the service', () => {
            expect(validationService).toBeTruthy();
        });

        it('and return false for empty answer', () => {
            let answerForm = formBuilder.group({
                id: [''],
                questionId: [''],
                userAnswerId: [''],
                text: [''],
                slider: [0],
                numberAnswer: [0],
                comment: [''],
                na: [false],
                answered: [false]
            });

            let question = new Question();
            expect(validationService.isQuestionAnswerValid(question, answerForm).isValid).toBeFalsy();
        });

        it('and return true for valid answer', () => {
            answerForm.controls.text.setValue("hejsa");
            answerForm.controls.text.markAsTouched();
            expect(validationService.isQuestionAnswerValid(requiredQuestion, answerForm).isValid).toBeTruthy();
        });

        it('and return false for invalid answer and give correct error message', () => {
            answerForm.controls.text.setValue("");
            answerForm.controls.text.markAsTouched();
            let validation = validationService.isQuestionAnswerValid(requiredQuestion, answerForm)
            expect(validation.isValid).toBeFalsy();
            expect(validation.errorMsg).toBe('Please enter a value (*Required)')
        });

        it('and return false for invalid regex answer and give correct error message', () => {
            answerForm.controls.text.setValue("");
            answerForm.controls.text.markAsTouched();
            let validation = validationService.isQuestionAnswerValid(requiredQuestion, answerForm)
            expect(validation.isValid).toBeFalsy();
            expect(validation.errorMsg).toBe('Please enter a value (*Required)')
        });

        it('and return true for empty text answer in non required question', () => {
            answerForm.controls.text.setValue("");
            answerForm.controls.text.markAsTouched();
            let validation = validationService.isQuestionAnswerValid(notRequiredQuestion, answerForm)
            expect(validation.isValid).toBeTruthy();
            expect(validation.errorMsg).toBe('null');
        });
    });
});
