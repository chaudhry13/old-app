import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionnaireUserAnswer, Question, QuestionAnsweres, QuestionAnsweredEdit } from 'src/app/_models/questionnaire';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QuestionAnsweredService } from 'src/app/_services/questionnaire.service';

@Component({
  selector: 'number-question',
  templateUrl: './number-question.component.html',
  styleUrls: ['./number-question.component.scss'],
})
export class NumberQuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;
  @Input() answerForm: FormGroup;

  from: string;
  to: string;

  questionAnswer: QuestionAnsweres;

  constructor(private questionAnsweredService: QuestionAnsweredService) { }

  ngOnInit() {
    this.questionAnswer = this.findQuestionAnswer(this.question.id);

    if (this.questionAnswer != null) {
      this.answerForm.controls["numberAnswer"].setValue(this.questionAnswer.numberAnswer);
    }

    this.answerForm.controls["numberAnswer"].setValidators([Validators.min(this.question.numberOptions.from), Validators.max(this.question.numberOptions.to)])

    this.from = this.question.numberOptions.from.toString();
    this.to = this.question.numberOptions.to.toString();

    this.answerForm.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe(x => {
        console.log("Number Changed in Question: " + this.question.title);
        console.log(x);
        console.log("is valid: " + this.answerForm.controls["numberAnswer"].valid);
        if (this.answerForm.controls["numberAnswer"].valid) {
          var answer = this.getQuestionAnswerEdit();
          this.questionAnsweredService.update(answer);
          console.log("Number updated");
        }
        else {
          console.log("not valid number");
        }
      });
  }

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

}
