import { Validators } from '@angular/forms';
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
  regularExpression: RegExp;

  saving: boolean;
  saved: boolean;

  public Email = /[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,64}/
  public PhoneNumber = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/

  constructor(private questionAnsweredService: QuestionAnsweredService, public qhs: QuestionnaireHelperService) { }

  ngOnInit() {
    this.questionAnswer = this.findQuestionAnswer(this.question.id);

    if (this.questionAnswer != null) {
      this.answerForm.controls["text"].setValue(this.questionAnswer.text);
    }

    switch (this.question.textOptions.type) {
      case this.textTypeToString["Custom Regex"]:
        this.regularExpression = new RegExp(this.question.textOptions.regex);
        break;
      case this.textTypeToString.Email:
        this.regularExpression = this.Email;
      case this.textTypeToString["Phone Number"]:
        this.regularExpression = this.PhoneNumber;
      default:
        this.regularExpression = new RegExp("");
        break;
    }


    this.answerForm.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe(x => {
        console.log("Text Changed in Question: " + this.question.title);
        console.log(x);
        console.log("regex: " + this.regularExpression);
        console.log("is valid: " + this.answerForm.controls["text"].valid + " && " + this.regularExpression.test(this.answerForm.controls["text"].value) + " && " + !this.qhs.isNullOrWhitespace(this.answerForm.controls["text"].value));
        if (this.answerForm.controls["text"].valid
          && this.regularExpression.test(this.answerForm.controls["text"].value)
          && !this.qhs.isNullOrWhitespace(this.answerForm.controls["text"].value)) {
          var answer = this.getQuestionAnswerEdit();
          this.questionAnsweredService.update(answer);
          console.log("Text updated");
        } else {
          console.log("not valid text!!");
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
