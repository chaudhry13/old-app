import { ToastService } from './../../../_services/toast.service';
import { QuestionAnsweredService } from './../../../_services/questionnaire.service';
import { Component, OnInit, Input } from '@angular/core';
import { QuestionTextType, Question, QuestionnaireUserAnswer, QuestionTypes, QuestionAnsweres, QuestionOption, optionAnswerFromQuestionAnswer, QuestionAnsweredEdit } from 'src/app/_models/questionnaire';
import { FormGroup } from '@angular/forms';
import { QuestionnaireHelperService } from 'src/app/_services/questionnaire-helper.service';

@Component({
  selector: 'radio-question',
  templateUrl: './radio-question.component.html',
  styleUrls: ['./radio-question.component.scss'],
})
export class RadioQuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;
  @Input() answerForm: FormGroup;

  QuestionTypes = QuestionTypes;
  textTypeToString = QuestionTextType;
  questionAnswer: QuestionAnsweres;

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
    this.questionAnswer = this.qhs.findQuestionAnswer(this.question.id, this.questionnaireUserAnswer);
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
