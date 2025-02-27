import { QuestionnaireHelperService } from "../../services/questionnaire-helper.service";
import { QuestionAnsweres } from "../../models/questionnaire";
import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionnaireUserAnswer, Question } from "../../models/questionnaire";

@Component({
  selector: "slider-question",
  templateUrl: "./slider-question.component.html",
  styleUrls: ["./slider-question.component.scss"],
})
export class SliderQuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;
  @Input() answerForm: FormGroup;
  @Input() questionAnswer: QuestionAnsweres;
  @Input() isReadOnly: boolean;

  public rangeValue: number;

  constructor(public qhs: QuestionnaireHelperService) {}
  ngOnInit() {
    this.questionAnswer = this.qhs.findQuestionAnswer(
      this.question.id,
      this.questionnaireUserAnswer
    );

    if (this.questionAnswer != null) {
      this.setSliderValue(false);
    } else {
      this.setDefaultSliderValue();
    }
  }

  private setDefaultSliderValue(): void {
    this.answerForm.controls.slider.setValue(
      this.question.sliderOptions.sliderFrom
    );
    this.rangeValue = this.question.sliderOptions.sliderFrom;
  }

  private setSliderValue(emit = true): void {
    this.answerForm.controls.slider.setValue(this.questionAnswer.slider, { emitEvent: emit });
    this.rangeValue = this.questionAnswer.slider;
  }

  public sliderValueChanged(): void {
    this.rangeValue = this.answerForm.controls.slider.value;
    const answerEdit = this.qhs.getQuestionAnswer(
      this.questionAnswer,
      this.question,
      this.questionnaireUserAnswer,
      this.answerForm
    );
    this.qhs.updateAnswer(answerEdit, this.questionAnswer, this.question);
  }
}
