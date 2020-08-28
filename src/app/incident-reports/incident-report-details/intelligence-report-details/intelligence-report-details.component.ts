import { Component, OnInit, Input } from '@angular/core';
import { IncidentReport } from 'src/app/_models/incident-report';

@Component({
  selector: 'intelligence-report-details',
  templateUrl: './intelligence-report-details.component.html',
  styleUrls: ['./intelligence-report-details.component.scss']
})
export class IntelligenceReportDetailsComponent implements OnInit {

  @Input() incidentReport: IncidentReport;

  constructor() { }

  ngOnInit() {
  }

}
