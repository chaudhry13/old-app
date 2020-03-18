import { ToastService } from './../../../_services/toast.service';
import { QuestionAnsweredService } from './../../../_services/questionnaire.service';
import { FormGroup } from '@angular/forms';
import { Question, QuestionnaireUserAnswer, QuestionOption, QuestionTypes, QuestionTextType, QuestionAnsweres, optionAnswerFromQuestionAnswer, QuestionAnsweredEdit } from './../../../_models/questionnaire';
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
    private questionAnsweredService: QuestionAnsweredService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.questionAnswer = this.findQuestionAnswer(this.question.id);
  }

  optionPressed(option: QuestionOption) {
    console.log(this.questionAnswer);
    if (!this.viewAnswer) {
      this.addUpdateQuestionOptionAnswer(option);
    }
    console.log(this.answerForm);
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

      answerEdit.optionAnswered.push(optionAnswered);

      this.updateAnswer(answerEdit);
    }
    //Update the option answer
    else {
      answerEdit.optionAnswered.find(x => x.questionOptionId == option.id).selected = !this.CheckValue(option);
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

  findQuestionAnswer(questionId: string): QuestionAnsweres {
    if (this.questionnaireUserAnswer) {
      return this.questionnaireUserAnswer.questionAnsweres.find(x => x.questionId == questionId);
    }
  }

  GetQuestionAnswer(Id: string) {
    console.log("ERror here? checkbox");
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
    var options = answer.optionAnswered.filter(x => x.selected);
    answered = options.length >= 1;
    return answered;
  }

  isNullOrWhitespace(input): boolean {
    if (typeof input === 'undefined' || input == null) return true;

    return input.replace(/\s/g, '').length < 1;
  }

}
