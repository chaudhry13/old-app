import { QuestionAnsweredService } from 'src/app/_services/questionnaire.service';
import { Component, OnInit, Input } from '@angular/core';
import { Question, QuestionnaireUserAnswer, QuestionTypes, QuestionTextType, QuestionAnsweres, QuestionAnsweredEdit } from 'src/app/_models/questionnaire';
import { FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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

  message: string = "";
  pattern: string = "";

  Type: QuestionTextType;
  saving: boolean;
  saved: boolean;

  constructor(private questionAnsweredService: QuestionAnsweredService) { }

  ngOnInit() {
    this.questionAnswer = this.findQuestionAnswer(this.question.id);
    this.pattern = this.question.textOptions.regex;
    this.answerForm.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe(x => {
        console.log("Text Changed in Question: " + this.question.title);
        console.log(x);
        var answer = this.getQuestionAnswerEdit();
        this.questionAnsweredService.update(answer);
        console.log("Text updated");
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
