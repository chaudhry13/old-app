import { Component, OnInit, Input } from '@angular/core';
import { IncidentReport } from 'src/app/features/incident-reports/models/incident-report';

@Component({
  selector: 'default-report-details',
  templateUrl: './default-report-details.component.html',
  styleUrls: ['./default-report-details.component.scss']
})
export class DefaultReportDetailsComponent implements OnInit {

  @Input() incidentReport: IncidentReport;

  constructor() { }

  ngOnInit() {
  }

}
