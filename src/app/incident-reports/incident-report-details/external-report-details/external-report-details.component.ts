import { Component, OnInit, Input } from '@angular/core';
import { IncidentReport } from 'src/app/_models/incident-report';

@Component({
  selector: 'external-report-details',
  templateUrl: './external-report-details.component.html',
  styleUrls: ['./external-report-details.component.scss']
})
export class ExternalReportDetailsComponent implements OnInit {
  @Input() incidentReport: IncidentReport;

  constructor() { }

  ngOnInit() {
  }

}