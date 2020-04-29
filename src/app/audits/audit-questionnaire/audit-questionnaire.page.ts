import { Component, OnInit } from '@angular/core';
import { QuestionAndGroups, QuestionnaireUserAnswer } from '../../_models/questionnaire';
import { QuestionnaireUserAnswerService } from 'src/app/_services/questionnaire.service';
import { QuestionnaireDetails } from 'src/app/_models/questionnaire';
import { ActivatedRoute } from '@angular/router';
import { AuditService } from 'src/app/_services/audit.service';

@Component({
  selector: 'app-audit-questionnaire',
  templateUrl: './audit-questionnaire.page.html',
  styleUrls: ['./audit-questionnaire.page.scss'],
})
export class AuditQuestionnairePage implements OnInit {

  id: string;
  isReadOnly = false;

  questionnaire: QuestionnaireDetails;
  questionnaireUserAnswer: QuestionnaireUserAnswer;

  questionsAndQuestionGroups: QuestionAndGroups[] = [];


  constructor(
    public activatedRoute: ActivatedRoute,
    public questionnaireUserAnswerService: QuestionnaireUserAnswerService,
    public auditService: AuditService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.questionnaireUserAnswerService.get(this.id).then(qua => {
      this.questionnaireUserAnswer = qua;
      this.questionnaire = qua.questionnaireSentOut.questionnaire;
      this.addQuestionsAndGroups();
      this.checkAuditStatus(this.questionnaireUserAnswer.auditId);
    });
  }

  addQuestionsAndGroups() {
    // Sorts the questions within each group
    this.questionnaire.questionGroups.forEach(g => g.questions = g.questions.sort((q1, q2) => q1.index - q2.index));

    // Adds the questions outside
    this.questionnaire.questions.filter(q => q.questionGroupId == null).forEach(x => {
      this.questionsAndQuestionGroups.push(
        {
          index: x.index,
          type: 'Question',
          reference: x,
        });
    });

    // Adds the questiongroups
    this.questionnaire.questionGroups.forEach(x => {
      var theGroup = { ...x };
      theGroup.questions = x.questions;

      // Adds the groups
      this.questionsAndQuestionGroups.push(
        {
          index: theGroup.index,
          type: "Group",
          reference: theGroup,
        }
      );
    });
    // Sorts the questions outside with the groups
    this.questionsAndQuestionGroups.sort((q1, q2) => q1.index - q2.index);
  }

  checkAuditStatus(auditId: string) {
    this.auditService.get(auditId).then(audit => {
      if (audit.completed) {
        this.isReadOnly = true;
      }
    });
  }
}
