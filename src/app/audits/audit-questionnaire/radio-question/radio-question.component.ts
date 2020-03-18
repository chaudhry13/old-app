import { ToastService } from './../../../_services/toast.service';
import { QuestionAnsweredService } from './../../../_services/questionnaire.service';
import { Component, OnInit, Input } from '@angular/core';
import { QuestionTextType, Question, QuestionnaireUserAnswer, QuestionTypes, QuestionAnsweres, QuestionOption, optionAnswerFromQuestionAnswer, QuestionAnsweredEdit } from 'src/app/_models/questionnaire';
import { FormGroup } from '@angular/forms';

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
    public questionAnsweredService: QuestionAnsweredService,
    public toastService: ToastService
  ) {
  }

  ngOnInit() {
    this.questionAnswer = this.findQuestionAnswer(this.question.id);
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

      answerEdit.optionAnswered.forEach(x => x.selected = false);
      answerEdit.optionAnswered.push(optionAnswered);

      this.updateAnswer(answerEdit);
    } else { //Update the option answer
      answerEdit.optionAnswered.forEach(x => x.selected = false);
      answerEdit.optionAnswered.find(x => x.questionOptionId == option.id).selected = true;
      this.updateAnswer(answerEdit);
    }
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

  GetQuestionAnswer(Id: string) {
    console.log("ERror here?");
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
