import { ValidationService } from './../../../_services/validation.service';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Question, QuestionTypes, QuestionTextType, QuestionOption, QuestionnaireUserAnswer, QuestionAnsweres, QuestionAnsweredEdit, optionAnswerFromQuestionAnswer } from 'src/app/_models/questionnaire';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/_services/toast.service';
import { QuestionAnsweredService } from 'src/app/_services/questionnaire.service';

@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;
  @Input() isInGroup: boolean;

  QuestionTypes = QuestionTypes;
  questionAnswer: QuestionAnsweres;
  answerForm: FormGroup;

  constructor(public formBuilder: FormBuilder, public validationService: ValidationService) {
    this.answerForm = this.formBuilder.group({
      id: [""],
      questionId: [""],
      userAnswerId: [""],
      text: [""],
      slider: [0],
      numberAnswer: [0],
      comment: [""],
      na: [false],
      answered: [false]
    });
  }

  ngOnInit() { }
}


