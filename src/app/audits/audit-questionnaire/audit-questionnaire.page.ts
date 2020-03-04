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

  testQuestionnaire: QuestionnaireDetails;
  id: string;

  constructor(private questionnaireService: QuestionnaireService,
              public activatedRoute: ActivatedRoute) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.questionnaireService.get(this.id).then(q => {
      this.testQuestionnaire = q;
      console.log(q);
    });
  }

}
