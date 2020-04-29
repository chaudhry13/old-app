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
  @Input() questionAnswer: QuestionAnsweres;
  @Input() isReadOnly: boolean;

  rangeValue: number;

  constructor(public qhs: QuestionnaireHelperService) { }

  // TODO: Cleanup
  ngOnInit() {
    this.questionAnswer = this.qhs.findQuestionAnswer(this.question.id, this.questionnaireUserAnswer);

    if (this.questionAnswer != null) {
      this.answerForm.controls.slider.setValue(this.questionAnswer.slider);
      this.rangeValue = this.questionAnswer.slider;
    } else {
      this.answerForm.controls.slider.setValue(this.question.sliderOptions.sliderFrom);
      this.rangeValue = this.question.sliderOptions.sliderFrom;
    }
  }

  valueChanged() {
    this.rangeValue = this.answerForm.controls.slider.value;
    var answerEdit = this.qhs.getQuestionAnswer(this.questionAnswer, this.question, this.questionnaireUserAnswer, this.answerForm);
    this.qhs.updateAnswer(answerEdit, this.questionAnswer, this.question);
  }

}
