import { Component, OnInit, Input } from '@angular/core';
import { QuestionTextType, Question, QuestionnaireUserAnswer, QuestionAnsweres, QuestionOption } from '@app/models/questionnaire';
import { FormGroup } from '@angular/forms';
import { QuestionnaireHelperService } from '@app/services/questionnaire-helper.service';

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
  @Input() isReadOnly: boolean;

  questionOptions: QuestionOption[];

  message = '';
  pattern = '';

  Type: QuestionTextType;
  saving: boolean;
  saved: boolean;

  constructor(
    public qhs: QuestionnaireHelperService
  ) { }

  ngOnInit() {
    this.questionOptions = this.question.possibleAnswers;
    this.questionOptions.sort((a, b) => a.index - b.index);
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
