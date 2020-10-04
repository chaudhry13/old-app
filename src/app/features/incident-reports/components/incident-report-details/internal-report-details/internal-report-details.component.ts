import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { IncidentReport } from 'src/app/features/incident-reports/models/incident-report';
import { CameraService } from 'src/app/core/services/photo.service';
import { Attachment } from 'src/app/core/models/file';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'internal-report-details',
  templateUrl: './internal-report-details.component.html',
  styleUrls: ['./internal-report-details.component.scss']
})
export class InternalReportDetailsComponent implements OnInit {
  @Input() incidentReport: IncidentReport;

  public files: Attachment[];
  public updateFilesList = new EventEmitter<any>();

  public photos: any = [];

  uploadProgress: number = 0;
  uploadAlert: HTMLIonAlertElement;

  constructor(
    private cameraService: CameraService,
    private storageService: StorageService) { }

  ngOnInit() {
  }

  onFileUpload() {
    this.updateFilesList.emit();
  }

}
