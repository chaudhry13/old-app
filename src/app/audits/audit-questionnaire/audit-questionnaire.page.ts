import { QuestionAndGroups } from './../../_models/questionnaire';
import { Component, OnInit } from '@angular/core';
import { QuestionnaireService } from 'src/app/_services/questionnaire.service';
import { QuestionnaireDetails } from 'src/app/_models/questionnaire';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-audit-questionnaire',
  templateUrl: './audit-questionnaire.page.html',
  styleUrls: ['./audit-questionnaire.page.scss'],
})
export class AuditQuestionnairePage implements OnInit {

  questionnaireId: string;
  questionnaire: QuestionnaireDetails;

  questionsAndQuestionGroups: QuestionAndGroups[] = [];

  constructor(private questionnaireService: QuestionnaireService,
    public activatedRoute: ActivatedRoute) {
    this.questionnaireId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.questionnaireService.get(this.questionnaireId).then(result => {
      this.questionnaire = result;
      this.addQuestionsAndGroups();
    });
  }

  addQuestionsAndGroups() {

    //Sorts the questions within each group
    this.questionnaire.questionGroups.forEach(g => g.questions = g.questions.sort((q1, q2) => q1.index - q2.index));

    //Adds the questions outside
    this.questionnaire.questions.filter(q => q.questionGroupId == null).forEach(x => {
      this.questionsAndQuestionGroups.push(
        {
          index: x.index,
          type: "Question",
          reference: x,
        })
    });

    //Adds the questiongroups
    this.questionnaire.questionGroups.forEach(x => {
      var theGroup = { ...x };
      theGroup.questions = x.questions;

      //Adds the groups
      this.questionsAndQuestionGroups.push(
        {
          index: theGroup.index,
          type: "Group",
          reference: theGroup,
        }
      );
    });
    //Sorts the questions outside with the groups
    this.questionsAndQuestionGroups.sort((q1, q2) => q1.index - q2.index);
  }
}
