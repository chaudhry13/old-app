import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncidentReport } from 'src/app/_models/incident-report';
import { IncidentReportService } from 'src/app/_services/incident-report.service';
import { StorageService } from 'src/app/_services/storage.service';
import { Attachment } from 'src/app/_models/file';

@Component({
  selector: 'app-incident-report-details',
  templateUrl: './incident-report-details.page.html',
  styleUrls: ['./incident-report-details.page.scss'],
})
export class IncidentReportDetailsPage implements OnInit {

  private id: string;
  private source: any;

  public incidentReport: IncidentReport;
  public files: Attachment[];

  constructor(public activatedRoute: ActivatedRoute, public incidentReportService: IncidentReportService, private storageService: StorageService) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.source = this.activatedRoute.snapshot.paramMap.get('source');
  }

  ngOnInit() {
    this.incidentReportService.get(this.id, this.source).then(incidentReport => {
      this.incidentReport = incidentReport;

      if (incidentReport.source == 0) {
        this.storageService.listIncidentReport(incidentReport.id).then(files => {
          this.files = files;
        });
      }
    });
  }
}
