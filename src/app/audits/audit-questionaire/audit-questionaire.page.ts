import { Component, OnInit } from '@angular/core';
import { QuestionaireService } from 'src/app/_services/questionaire.service';
import { QuestionnaireDetails } from 'src/app/_models/questionaire';

@Component({
  selector: 'app-audit-questionaire',
  templateUrl: './audit-questionaire.page.html',
  styleUrls: ['./audit-questionaire.page.scss'],
})
export class AuditQuestionairePage implements OnInit {

  testQuestionaire: QuestionnaireDetails;

  constructor(private questionnaireService: QuestionaireService) { }

  ngOnInit() {
    this.questionnaireService.get("b29aa4bd-6361-44e5-b80d-be6a1e9f55d4").then(q => {
      this.testQuestionaire = q;
      console.log(q);
    });
  }

}
