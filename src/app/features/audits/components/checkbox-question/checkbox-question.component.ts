import { QuestionnaireHelperService } from '@app/services/questionnaire-helper.service';
import { FormGroup } from '@angular/forms';
import { Question, QuestionnaireUserAnswer, QuestionOption, QuestionAnsweres} from '@app/models/questionnaire';
import { Component, OnInit, Input } from '@angular/core';

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
  @Input() isReadOnly: boolean;

  questionOptions: QuestionOption[];

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
