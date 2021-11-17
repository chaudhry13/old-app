import { Component, OnInit } from "@angular/core";
import {
  QuestionAndGroups,
  QuestionnaireUserAnswer,
  QuestionTypes,
} from "../../models/questionnaire";
import { QuestionnaireUserAnswerService } from "../../services/questionnaire.service";
import { QuestionnaireDetails } from "../../models/questionnaire";
import { ActivatedRoute } from "@angular/router";
import { AuditService } from "../../services/audit.service";
import { NavController } from "@ionic/angular";
import { LogicService } from "../../services/logic.service";

@Component({
  selector: "app-audit-questionnaire",
  templateUrl: "./audit-questionnaire.page.html",
  styleUrls: ["./audit-questionnaire.page.scss"],
})
export class AuditQuestionnairePage implements OnInit {
  id: string;
  isReadOnly = false;

  questionnaire: QuestionnaireDetails;
  questionnaireUserAnswer: QuestionnaireUserAnswer;

  questionsAndQuestionGroups: QuestionAndGroups[] = [];
  toSkip: string[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public questionnaireUserAnswerService: QuestionnaireUserAnswerService,
    public auditService: AuditService,
    public navCtrl: NavController,
    public logicService: LogicService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    
    this.questionnaireUserAnswerService.get(this.id).then((qua) => {
      this.questionnaireUserAnswer = qua;
      this.questionnaire = qua.questionnaireSentOut.questionnaire;
      this.addQuestionsAndGroups();
      this.checkAuditCompleteStatus(this.questionnaireUserAnswer.auditId);
    });
    
  }

  addQuestionsAndGroups() {
    // Sorts the questions within each group
    this.questionnaire.questionGroups.forEach(
      (g) => (g.questions = g.questions.sort((q1, q2) => q1.index - q2.index))
    );

    // Adds the questions outside
    this.questionnaire.questions
      .filter((q) => q.questionGroupId == null)
      .forEach((x) => {
        this.questionsAndQuestionGroups.push({
          index: x.index,
          type: "Question",
          reference: x,
        });
      });

    // Adds the QuestionGroups
    this.questionnaire.questionGroups.forEach((x) => {
      var theGroup = { ...x };
      theGroup.questions = x.questions;

      // Adds the groups
      this.questionsAndQuestionGroups.push({
        index: theGroup.index,
        type: "Group",
        reference: theGroup,
      });
    });
    // Sorts the questions outside with the groups
    this.questionsAndQuestionGroups.sort((q1, q2) => q1.index - q2.index);
  }

  checkAuditCompleteStatus(auditId: string) {
    this.auditService.get(auditId).then((audit) => {
      if (audit.completed) {
        this.isReadOnly = true;
      }
    });
  }

  navigateBackToCompleteView() {
    this.navCtrl
      .navigateBack(
        "/tabs/tab1/complete/" + this.questionnaireUserAnswer.auditId
      )
      .then();
  }

  answerChanged(newAnswer) {
    console.log("Answer Chnged medu");
    
    // Find questions to skip when the answer changes
    this.logicService.WhichToSkip(this.questionnaire.questions, newAnswer).then(toSkip => {
      this.toSkip = toSkip;
    })
  }

  validateQuestionnaire(): boolean {
    return true;
  }
}
