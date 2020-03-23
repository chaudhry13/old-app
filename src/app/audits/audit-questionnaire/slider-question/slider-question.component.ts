import { QuestionnaireHelperService } from 'src/app/_services/questionnaire-helper.service';
import { QuestionAnsweres } from './../../../_models/questionnaire';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionnaireUserAnswer, Question } from 'src/app/_models/questionnaire';

@Component({
  selector: 'slider-question',
  templateUrl: './slider-question.component.html',
  styleUrls: ['./slider-question.component.scss'],
})
export class SliderQuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;
  @Input() answerForm: FormGroup;

  sliderValue: number;
  questionAnswer: QuestionAnsweres;

  constructor(public qhs: QuestionnaireHelperService) { }

  ngOnInit() {
    this.questionAnswer = this.qhs.findQuestionAnswer(this.question.id, this.questionnaireUserAnswer);

    this.answerForm.controls["slider"].setValue(this.question.sliderOptions.sliderFrom);
    this.sliderValue = this.question.sliderOptions.sliderFrom;
    this.valueChanged();
  }

  valueChanged() {
    var answerEdit = this.qhs.getQuestionAnswer(this.questionAnswer, this.question, this.questionnaireUserAnswer, this.answerForm);
    answerEdit.answered = true;
    console.log(answerEdit.answered);
    this.qhs.updateAnswer(answerEdit, this.questionAnswer, this.question);
  }

}
