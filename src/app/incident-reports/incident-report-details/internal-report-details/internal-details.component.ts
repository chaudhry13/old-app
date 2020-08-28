import { Component, OnInit, Input } from '@angular/core';
import { IncidentReport } from 'src/app/_models/incident-report';
import { CameraService } from 'src/app/_services/photo.service';
import { Attachment } from 'src/app/_models/file';
import { StorageService } from 'src/app/_services/storage.service';

@Component({
  selector: 'internal-details',
  templateUrl: './internal-details.component.html',
  styleUrls: ['./internal-details.component.scss']
})
export class InternalReportDetailsComponent implements OnInit {
  @Input() incidentReport: IncidentReport;

  public files: Attachment[];

  public photos: any = [];

  uploadProgress: number = 0;
  uploadAlert: HTMLIonAlertElement;

  constructor(
    private cameraService: CameraService,
    private storageService: StorageService) { }

  ngOnInit() {
  }

  takePhotoAndUpload() {
    this.cameraService
      .takePhotoAndUpload(
        "/incident-report?incidentReportId=" + this.incidentReport.id,
        this.photos.length
      )
      .then((result) => {
        if (result) this.listFiles();
      })
      .catch(() => {
        // This is taken care of in takePhotoAndUpload()
      });
  }

  async listFiles() {
    this.storageService
      .listIncidentReport(this.incidentReport.id)
      .then((files) => {
        this.files = files;
      });
  }

  async removePicture(file: Attachment) {
    const confirm = await this.cameraService.deleteConfirmationAlert();
    if (confirm) {
      this.storageService
        .deleteIncidentReport(this.incidentReport.id, file.name)
        .then(() => {
          this.listFiles();
        });
    }
  }

}
