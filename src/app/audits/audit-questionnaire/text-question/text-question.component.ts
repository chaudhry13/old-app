import { ValidationService } from './../../../_services/validation.service';
import { QuestionAnsweredService } from 'src/app/_services/questionnaire.service';
import { Component, OnInit, Input } from '@angular/core';
import { Question, QuestionnaireUserAnswer, QuestionTypes, QuestionTextType, QuestionAnsweres, QuestionAnsweredEdit } from 'src/app/_models/questionnaire';
import { FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QuestionnaireHelperService } from 'src/app/_services/questionnaire-helper.service';

@Component({
  selector: 'text-question',
  templateUrl: './text-question.component.html',
  styleUrls: ['./text-question.component.scss'],
})
export class TextQuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;
  @Input() answerForm: FormGroup;

  QuestionTypes = QuestionTypes;
  textTypeToString = QuestionTextType;
  questionAnswer: QuestionAnsweres;

  viewAnswer: Boolean;

  saving: boolean;
  saved: boolean;

  constructor(private questionAnsweredService: QuestionAnsweredService, public qhs: QuestionnaireHelperService, public validationService: ValidationService) { }

  ngOnInit() {
    this.questionAnswer = this.findQuestionAnswer(this.question.id);

    if (this.questionAnswer != null) {
      this.answerForm.controls["text"].setValue(this.questionAnswer.text);
    }

    this.answerForm.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        console.log(this.validationService.isQuestionAnswerValid(this.question, this.answerForm).isValid);
        if (this.validationService.isQuestionAnswerValid(this.question, this.answerForm).isValid) {
          var answer = this.getQuestionAnswerEdit();
          this.questionAnsweredService.update(answer);
        }
      });
  }

  /* TODO: These functions should be extracted to the questionnaire helper service */
  findQuestionAnswer(questionId: string): QuestionAnsweres {
    if (this.questionnaireUserAnswer) {
      return this.questionnaireUserAnswer.questionAnsweres.find(x => x.questionId == questionId);
    }
  }

  getQuestionAnswerEdit() {
    var answerEdit: QuestionAnsweredEdit =
    {
      id: this.questionAnswer.id,
      questionId: this.question.id,
      userAnswerId: this.questionnaireUserAnswer.id,
      text: this.answerForm.controls["text"].value,
      slider: this.answerForm.controls["slider"].value,
      numberAnswer: this.answerForm.controls["numberAnswer"].value,
      comment: this.answerForm.controls["comment"].value,
      na: this.answerForm.controls["na"].value,
      optionAnswered: this.questionAnswer.optionAnswered,
      answered: true
    };

    return answerEdit;
  }
  /* ************************************************************************** */
}
