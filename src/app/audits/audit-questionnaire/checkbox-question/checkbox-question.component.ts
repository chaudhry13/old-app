import { QuestionnaireHelperService } from '../../../_services/questionnaire-helper.service';
import { FormGroup } from '@angular/forms';
import { Question, QuestionnaireUserAnswer, QuestionOption,
  QuestionTypes, QuestionTextType, QuestionAnsweres} from '../../../_models/questionnaire';
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
