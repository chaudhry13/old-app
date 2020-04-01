import { QuestionnaireService } from './questionnaire.service';
import { QuestionAnsweredService } from 'src/app/_services/questionnaire.service';
import { ToastService } from './toast.service';
import { FormGroup } from '@angular/forms';
import { QuestionnaireUserAnswer, Question, QuestionTypes } from './../_models/questionnaire';
import { Injectable } from '@angular/core';
import { QuestionOption, QuestionAnsweres, QuestionAnsweredEdit, optionAnswerFromQuestionAnswer } from '../_models/questionnaire';

@Injectable()
export class QuestionnaireHelperService {

  constructor(
    private toastService: ToastService,
    private questionAnsweredService: QuestionAnsweredService,
    private questionnaireService: QuestionnaireService
  ) { }

  public CheckOptionValue(questionAnswer: QuestionAnsweres, option: QuestionOption): boolean {
    try {
      return questionAnswer.optionAnswered.find(x => x.questionOptionId == option.id).selected;
    }
    catch (e) {
      return false;
    }
  }

  public findQuestionAnswer(questionId: string, questionnaireUserAnswer: QuestionnaireUserAnswer): QuestionAnsweres {
    return questionnaireUserAnswer.questionAnsweres.find(x => x.questionId == questionId);
  }

  public updateOptionAnswer(
    questionAnswer: QuestionAnsweres,
    option: QuestionOption,
    question: Question,
    questionnaireUserAnswer: QuestionnaireUserAnswer,
    answerForm: FormGroup
  ) {

    var answerEdit: QuestionAnsweredEdit =
      this.getQuestionAnswer(questionAnswer, question, questionnaireUserAnswer, answerForm);

    answerEdit.optionAnswered = questionAnswer.optionAnswered;

    //Checks if there is an answer for the option
    var optionAnsweredTest = questionAnswer.optionAnswered.find(x => x.questionOptionId == option.id);
    //Create the option answer
    if (optionAnsweredTest == null) {
      var optionAnswered: optionAnswerFromQuestionAnswer = {
        selected: true,
        questionOptionId: option.id,
      }

      if (question.type == QuestionTypes["Radio Button"]) {
        answerEdit.optionAnswered.forEach(x => x.selected = false);
      }
      answerEdit.optionAnswered.push(optionAnswered);

      this.updateAnswer(answerEdit, questionAnswer, question);
    }
    //Update the option answer
    else {
      if (question.type == QuestionTypes.Checkbox) {
        answerEdit.optionAnswered.find(x => x.questionOptionId == option.id).selected = !this.CheckOptionValue(questionAnswer, option);
      }
      else if (question.type == QuestionTypes["Radio Button"]) {
        answerEdit.optionAnswered.forEach(x => x.selected = false);
        answerEdit.optionAnswered.find(x => x.questionOptionId == option.id).selected = true;
      }

      this.updateAnswer(answerEdit, questionAnswer, question);
    }
  }

  public getQuestionAnswer(questionAnswer: QuestionAnsweres, question: Question, questionnaireUserAnswer: QuestionnaireUserAnswer, answerForm: FormGroup): QuestionAnsweredEdit {
    return {
      id: questionAnswer.id,
      questionId: question.id,
      userAnswerId: questionnaireUserAnswer.id,
      text: answerForm.controls["text"].value,
      slider: answerForm.controls["slider"].value,
      numberAnswer: answerForm.controls["numberAnswer"].value,
      comment: answerForm.controls["comment"].value,
      na: answerForm.controls["na"].value,
      optionAnswered: questionAnswer.optionAnswered,
      answered: true
    };
  }

  public updateAnswer(answerEdit: QuestionAnsweredEdit, questionAnswer: QuestionAnsweres, question: Question, ) {
    // TODO: Fix Saving / Saved toasts
    var saving = false;
    var saved = false;
    var isanswered = this.HasAnswer(answerEdit, question);
    answerEdit.answered = isanswered;
    saving = true;
    this.toastService.show("Saving");

    this.questionAnsweredService.update(answerEdit).then(Id => {
      saving = false;
      if (isanswered || questionAnswer.na) {
        saved = true;
      }
      else {
        saved = false;
      }
      this.toastService.show("Saved");
    }).catch(onrejected => {
      saving = false;
      saved = false;

      this.toastService.show("Could not save!");
    });
  }

  private HasAnswer(answer: QuestionAnsweredEdit, question: Question): boolean {
    var answered = true;
    switch (question.type) {
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

  // TODO: This function is also in validation.service... Maybe remove here.
  public isNullOrWhitespace(input): boolean {
    if (typeof input === 'undefined' || input == null) return true;

    return input.replace(/\s/g, '').length < 1;
  }
}
