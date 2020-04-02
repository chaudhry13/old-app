import { QuestionTextOptions } from './../_models/questionnaire';
import { QuestionTypes, Question, QuestionTextType } from 'src/app/_models/questionnaire';
import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable()
export class ValidationService {

  constructor() { }

  isQuestionAnswerValid(question: Question, answerForm: FormGroup): QuestionValidation {
    if (!Object.keys(answerForm.controls).every(c => answerForm.controls[c].untouched)) { // If NOT all controls are untouched we validate
      return this.validateQuestion(question, answerForm);
    } else {
      return { isValid: false, regExp: new RegExp(""), errorMsg: "" };
    }
  }

  validateQuestion(question: Question, answerForm: FormGroup) {
    switch (question.type) {
      case QuestionTypes.Checkbox:
        return this.checkboxValidation()

      case QuestionTypes["Radio Button"]:
        return this.radioButtonValidation()

      case QuestionTypes.Number:
        return this.numberValidation(question, answerForm)

      case QuestionTypes.Text:
        return this.textValidation(question, answerForm);

      case QuestionTypes.Slider:
        return this.sliderValidation();

      default:
        return { isValid: false, regExp: new RegExp(""), errorMsg: "An error occured!" };
    }
  }

  numberValidation(question: Question, answerForm: FormGroup): QuestionValidation {
    if (this.isNullOrWhitespace(answerForm.controls["numberAnswer"])) {
      if (question.required) {
        return { isValid: true, regExp: null, errorMsg: "Please enter a value" }
      }
    }

    if (this.checkNumberRange(answerForm, question)) {
      return { isValid: true, regExp: null, errorMsg: null };
    } else {
      return { isValid: false, regExp: null, errorMsg: "Your response must be between " + question.numberOptions.from + " and " + question.numberOptions.to };
    }
  }

  textValidation(question: Question, answerForm: FormGroup): QuestionValidation {
    var regularExpType = this.findRegularExpressionAndErrorMessage(question);

    if (regularExpType.regExp.test(answerForm.controls["text"].value)
      && answerForm.controls["text"].valid
      || answerForm.controls["text"].untouched) {
      regularExpType.isValid = true;
    }

    if (this.isNullOrWhitespace(answerForm.controls["text"].value) && question.required) {
      regularExpType.isValid = false;
      regularExpType.errorMsg = "Please enter a value (*Required)";
    }

    return regularExpType;
  }

  // No validation here yet
  sliderValidation() {
    return { isValid: true, regExp: null, errorMsg: null };
  }

  // No validation here yet
  radioButtonValidation() {
    return { isValid: true, regExp: null, errorMsg: null };
  }

  // No validation here yet
  checkboxValidation() {
    return { isValid: true, regExp: null, errorMsg: null };
  }

  private findRegularExpressionAndErrorMessage(question: Question): QuestionValidation {
    var email = /[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,64}/;
    var phoneNumber = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

    switch (question.textOptions.type) {
      case QuestionTextType["Custom Regex"]:
        return {
          isValid: false,
          regExp: new RegExp(question.textOptions.regex),
          errorMsg: "The text should comply with the following regularexpression: " + question.textOptions.regex.toString()
        };
      case QuestionTextType.Email:
        return { isValid: false, regExp: email, errorMsg: "Please enter a valid email address" };
      case QuestionTextType["Phone Number"]:
        return { isValid: false, regExp: phoneNumber, errorMsg: "Please enter a valid telephone number" };
      default:
        return { isValid: false, regExp: new RegExp(""), errorMsg: "Please enter a value" };
    }
  }

  private isNullOrWhitespace(input): boolean {
    if (typeof input === 'undefined' || input == null) return true;
    return input.toString().replace(/\s/g, '').length < 1;
  }

  private checkNumberRange(answerForm: FormGroup, question: Question) {
    return +answerForm.controls["numberAnswer"].value >= question.numberOptions.from && +answerForm.controls["numberAnswer"].value <= question.numberOptions.to;
  }
}


interface QuestionValidation {
  isValid: boolean,
  regExp: RegExp,
  errorMsg: string
}