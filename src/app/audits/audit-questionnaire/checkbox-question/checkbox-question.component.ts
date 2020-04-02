import { QuestionnaireHelperService } from './../../../_services/questionnaire-helper.service';
import { ToastService } from './../../../_services/toast.service';
import { QuestionAnsweredService } from './../../../_services/questionnaire.service';
import { FormGroup } from '@angular/forms';
import { Question, QuestionnaireUserAnswer, QuestionOption, QuestionTypes, QuestionTextType, QuestionAnsweres, optionAnswerFromQuestionAnswer, QuestionAnsweredEdit } from './../../../_models/questionnaire';
import { Component, OnInit, Input } from '@angular/core';

// TODO: Sort question options!

@Component({
  selector: 'checkbox-question',
  templateUrl: './checkbox-question.component.html',
  styleUrls: ['./checkbox-question.component.scss'],
})
export class CheckboxQuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;
  @Input() answerForm: FormGroup;
  @Input() questionAnswer: QuestionAnsweres;

  QuestionTypes = QuestionTypes;
  textTypeToString = QuestionTextType;

  viewAnswer: Boolean;

  message: string = "";
  pattern: string = "";

  Type: QuestionTextType;
  saving: boolean;
  saved: boolean;


  constructor(
    public qhs: QuestionnaireHelperService
  ) { }

  ngOnInit() {
  }

  optionPressed(option: QuestionOption) {
    this.qhs.updateOptionAnswer(
      this.questionAnswer,
      option, this.question,
      this.questionnaireUserAnswer,
      this.answerForm
    );
  }

}
