import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Question, QuestionTypes, QuestionTextType, QuestionOption, QuestionnaireUserAnswer, QuestionAnsweres, QuestionAnsweredEdit, optionAnswerFromQuestionAnswer } from 'src/app/_models/questionnaire';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/_services/toast.service';
import { QuestionAnsweredService } from 'src/app/_services/questionnaire.service';

@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;

  QuestionTypes = QuestionTypes;
  textTypeToString = QuestionTextType;
  questionAnswer: QuestionAnsweres;

  answerForm: FormGroup;

  message: string = "";
  pattern: string = "";

  Type: QuestionTextType;
  saving: boolean;
  saved: boolean;

  constructor(public formBuilder: FormBuilder, public toastService: ToastService, public questionAnsweredService: QuestionAnsweredService) {
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

  ngOnInit() {
  }
}


