import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Question, QuestionTypes, QuestionTextType, QuestionOption, QuestionnaireUserAnswer, QuestionAnsweres, QuestionAnsweredEdit, optionAnswerFromQuestionAnswer } from 'src/app/_models/questionnaire';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/_services/toast.service';
import { QuestionAnsweredService } from 'src/app/_services/questionnaire.service';

@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;

  QuestionTypes = QuestionTypes;
  textTypeToString = QuestionTextType;
  questionAnswer: QuestionAnsweres;

  answerForm: FormGroup;

  viewAnswer: Boolean;

  message: string = "";
  pattern: string = "";

  Type: QuestionTextType;
  saving: boolean;
  saved: boolean;

  constructor(public formBuilder: FormBuilder, public toastService: ToastService, public questionAnsweredService: QuestionAnsweredService) {
    this.answerForm = this.formBuilder.group({
      id: [""],
      questionId: [""],
      userAnswerId: [""],
      text: [""],
      slider: [0],
      numberAnswer: [0],
      comment: [""],
      na: [false],
      answered: [false]
    });
  }

  ngOnInit() {
    this.viewAnswer = false;
    console.log(this.questionnaireUserAnswer);
    console.log("hello there");
    this.questionAnswer = this.questionnaireUserAnswer.questionAnsweres.find(q => q.questionId == this.question.id);
    if (this.question.type == QuestionTypes.Text)
      this.Type = this.question.textOptions.type;
    console.log(this.questionAnswer);
  }

  optionPressed(option: QuestionOption) {
    if (!this.viewAnswer) {
      this.addUpdateQuestionOptionAnswer(option);
    }
  }

  CheckValue(option: QuestionOption) {
    try {
      return this.questionAnswer.optionAnswered.find(x => x.questionOptionId == option.id).selected;
    }
    catch (e) {
      return false;
    }
  }

  addUpdateQuestionOptionAnswer(option: QuestionOption) {
    //You need to update the answer:
    var answerEdit = this.getQuestionAnswerEdit();
    answerEdit.optionAnswered = this.questionAnswer.optionAnswered;

    //Checks if there is an answer for the option
    var optionAnsweredTest = this.questionAnswer.optionAnswered.find(x => x.questionOptionId == option.id);
    //Create the option answer
    if (optionAnsweredTest == null) {
      var optionAnswered: optionAnswerFromQuestionAnswer = {
        selected: true,
        questionOptionId: option.id,
      }

      if (this.question.type == QuestionTypes["Radio Button"]) {
        answerEdit.optionAnswered.forEach(x => x.selected = false);
      }
      answerEdit.optionAnswered.push(optionAnswered);

      this.updateAnswer(answerEdit);
    }
    //Update the option answer
    else {
      if (this.question.type == QuestionTypes.Checkbox) {
        answerEdit.optionAnswered.find(x => x.questionOptionId == option.id).selected = !this.CheckValue(option);
      }
      else if (this.question.type == QuestionTypes["Radio Button"]) {
        answerEdit.optionAnswered.forEach(x => x.selected = false);
        answerEdit.optionAnswered.find(x => x.questionOptionId == option.id).selected = true;
      }

      this.updateAnswer(answerEdit);
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

  GetQuestionAnswer(Id: string) {
    this.questionAnsweredService.get(Id).then(model => {
      this.questionAnswer = model;
      //this.answerUpdated.emit(this.questionAnswer);
    });
  }

  updateAnswer(answerEdit: QuestionAnsweredEdit) {
    var isanswered = this.HasAnswer(answerEdit);
    answerEdit.answered = isanswered;
    this.saving = true;
    this.toastService.show("Saving");

    this.questionAnsweredService.update(answerEdit).then(Id => {
      this.GetQuestionAnswer(Id);
      this.saving = false;
      if (isanswered || this.questionAnswer.na) {
        this.saved = true;
      }
      else {
        this.saved = false;
      }
      this.toastService.show("Saved");
    }).catch(onrejected => {
      this.saving = false;
      this.saved = false;

      this.toastService.show("Could not save!");
    });
  }

  HasAnswer(answer: QuestionAnsweredEdit): boolean {
    var answered = true;
    switch (this.question.type) {
      case QuestionTypes.Number:
        answered = answer.numberAnswer != null
        break;

      case QuestionTypes.Text:
        answered = !this.isNullOrWhitespace(answer.text);
        break;

      case QuestionTypes.Slider:
        answered = answer.slider != null
        break;

      case QuestionTypes.Checkbox:
      case QuestionTypes["Radio Button"]:
        var options = answer.optionAnswered.filter(x => x.selected);
        answered = options.length >= 1;
        break;
    }

    return answered;
  }

  isNullOrWhitespace(input): boolean {
    if (typeof input === 'undefined' || input == null) return true;

    return input.replace(/\s/g, '').length < 1;
  }
}


