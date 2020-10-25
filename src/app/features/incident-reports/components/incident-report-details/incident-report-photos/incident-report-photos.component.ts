import { Component, OnInit, Input, EventEmitter } from "@angular/core";
import { IncidentReport } from "src/app/features/incident-reports/models/incident-report";
import { StorageService } from "src/app/core/services/storage.service";
import { CameraService } from "src/app/core/services/photo.service";
import { Attachment } from "src/app/core/models/file";

@Component({
  selector: "incident-report-photos",
  templateUrl: "./incident-report-photos.component.html",
  styleUrls: ["./incident-report-photos.component.scss"],
})
export class IncidentReportPhotosComponent implements OnInit {
  @Input() incidentReport: IncidentReport;
  @Input() updateFiles: EventEmitter<any>;

  public files: Attachment[];
  public photos: any = [];

  constructor(
    private storageService: StorageService,
    private cameraService: CameraService
  ) {}

  ngOnInit() {
    this.listFiles();
    this.updateFiles.subscribe(() => {
      this.listFiles();
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
