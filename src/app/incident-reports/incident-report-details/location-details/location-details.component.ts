import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { IncidentReport } from 'src/app/_models/incident-report';

@Component({
  selector: 'location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationDetailsComponent implements OnInit {
  @Input() incidentReport: IncidentReport;

  constructor() { }

  ngOnInit() {
  }

}
