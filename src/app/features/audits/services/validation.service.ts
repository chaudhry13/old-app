import { QuestionTextOptions } from '@app/models/questionnaire';
import { QuestionTypes, Question, QuestionTextType } from '@app/models/questionnaire';
import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable()
export class ValidationService {

  // TODO: GENERAL
  // - The validation service should not be call as often. There is no need to. The code is not that readable

  constructor() { }

  isQuestionAnswerValid(question: Question, answerForm: FormGroup): QuestionValidation {
    if (!Object.keys(answerForm.controls).every(c => answerForm.controls[c].untouched)) { // If NOT all controls are untouched we validate
      return this.validateQuestion(question, answerForm);
    } else {
      return { isValid: false, regExp: new RegExp(''), errorMsg: '' };
    }
  }

  validateQuestion(question: Question, answerForm: FormGroup) {
    switch (question.type) {
      case QuestionTypes.Checkbox:
        return this.checkboxValidation();

      case QuestionTypes['Radio Button']:
        return this.radioButtonValidation();

      case QuestionTypes.Number:
        return this.numberValidation(question, answerForm);

      case QuestionTypes.Text:
        return this.textValidation(question, answerForm);

      case QuestionTypes.Slider:
        return this.sliderValidation();

      case QuestionTypes.Location:
        return this.locationValidation();
      default:
        return { isValid: false, regExp: new RegExp(''), errorMsg: 'An error occured!' };
    }
  }

  numberValidation(question: Question, answerForm: FormGroup): QuestionValidation {
    if (this.isNullOrWhitespace(answerForm.controls.numberAnswer)) {
      if (question.required) {
        return { isValid: true, regExp: null, errorMsg: 'Please enter a value' };
      }
    }

    if (this.checkNumberRange(answerForm, question)) {
      return { isValid: true, regExp: null, errorMsg: null };
    } else {
      return {
        isValid: false, regExp: null, errorMsg: 'Your response must be between '
          + question.numberOptions.from + ' and '
          + question.numberOptions.to
      };
    }
  }

  textValidation(question: Question, answerForm: FormGroup): QuestionValidation {
    const regularExpType = this.findRegularExpressionAndErrorMessage(question);

    if (this.isNullOrWhitespace(answerForm.controls.text.value) && question.required) {
      regularExpType.isValid = false;
      regularExpType.errorMsg = 'Please enter a value (*Required)';
    }

    if (this.isNullOrWhitespace(answerForm.controls.text.value) && !question.required) {
      regularExpType.isValid = true;
      regularExpType.errorMsg = 'null';
    }

    if ((!this.isNullOrWhitespace(answerForm.controls.text.value)
      && regularExpType.regExp.test(answerForm.controls.text.value)
      && answerForm.controls.text.valid)
      || answerForm.controls.text.untouched) {
      regularExpType.isValid = true;
    }

    return regularExpType;
  }

  private findRegularExpressionAndErrorMessage(question: Question): QuestionValidation {
    const email = /[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,64}/;
    const phoneNumber = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

    switch (question.textOptions.type) {
      case QuestionTextType['Custom Regex']:
        return {
          isValid: false,
          regExp: new RegExp(question.textOptions.regex),
          errorMsg: 'The text should comply with the following regular expression: ' + question.textOptions.regex.toString()
        };
      case QuestionTextType.Email:
        return { isValid: false, regExp: email, errorMsg: 'Please enter a valid email address' };
      case QuestionTextType['Phone Number']:
        return { isValid: false, regExp: phoneNumber, errorMsg: 'Please enter a valid telephone number' };
      default:
        return { isValid: false, regExp: new RegExp(''), errorMsg: 'Please enter a value' };
    }
  }

  private isNullOrWhitespace(input): boolean {
    if (typeof input === 'undefined' || input == null) { return true; }
    return input.toString().replace(/\s/g, '').length < 1;
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

  // No validation here yet
  locationValidation() {
    // FIXME: CALLED TOO MUCH
    //console.log("validating location")
    return { isValid: true, regExp: null, errorMsg: null };
  }

  private checkNumberRange(answerForm: FormGroup, question: Question) {
    return +answerForm.controls.numberAnswer.value >= question.numberOptions.from
      && +answerForm.controls.numberAnswer.value <= question.numberOptions.to;
  }
}


interface QuestionValidation {
  isValid: boolean;
  regExp: RegExp;
  errorMsg: string;
}
