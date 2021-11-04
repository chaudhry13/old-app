import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import {
  QuestionGroupDetails,
  QuestionnaireUserAnswer,
} from "../../models/questionnaire";

@Component({
  selector: "question-group",
  templateUrl: "./question-group.component.html",
  styleUrls: ["./question-group.component.scss"],
})
export class QuestionGroupComponent implements OnInit, OnChanges {
  @Input() questionGroup: QuestionGroupDetails;
  @Input() isReadOnly: boolean;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;
  @Input() toSkip: string[];
  @Output() questionnaireUserAnswerChange = new EventEmitter();

  constructor() {}
  
  ngOnInit() {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.questionnaireUserAnswer) {
      this.updateLogic();
    }
  }

  changedAnswer(newAnswer) {
    this.questionnaireUserAnswerChange.emit(newAnswer);
  }

  updateLogic() {
    console.log("Update logic in group!");
  }
}
