import { ToastService } from './../../../_services/toast.service';
import { QuestionAnsweredService } from './../../../_services/questionnaire.service';
import { Component, OnInit, Input } from '@angular/core';
import { QuestionTextType, Question, QuestionnaireUserAnswer, QuestionTypes, QuestionAnsweres, QuestionOption, optionAnswerFromQuestionAnswer, QuestionAnsweredEdit } from 'src/app/_models/questionnaire';
import { FormGroup } from '@angular/forms';
import { QuestionnaireHelperService } from 'src/app/_services/questionnaire-helper.service';

// TODO: Sort question options!

@Component({
  selector: 'radio-question',
  templateUrl: './radio-question.component.html',
  styleUrls: ['./radio-question.component.scss'],
})
export class RadioQuestionComponent implements OnInit {
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
