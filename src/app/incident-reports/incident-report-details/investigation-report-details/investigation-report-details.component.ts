import { Component, OnInit, Input } from '@angular/core';
import { IncidentReport } from 'src/app/_models/incident-report';

@Component({
  selector: 'investigation-report-details',
  templateUrl: './investigation-report-details.component.html',
  styleUrls: ['./investigation-report-details.component.scss']
})
export class InvestigationReportDetailsComponent implements OnInit {
  @Input() incidentReport: IncidentReport;

  constructor() { }

  ngOnInit() {
  }

}
