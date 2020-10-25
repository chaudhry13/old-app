import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IncidentReport } from "src/app/features/incident-reports/models/incident-report";
import { CameraService } from "src/app/core/services/photo.service";

@Component({
  selector: "take-photo-button",
  templateUrl: "./take-photo-button.component.html",
  styleUrls: ["./take-photo-button.component.scss"],
})
export class TakePhotoButtonComponent implements OnInit {
  @Input() incidentReport: IncidentReport;
  @Output() uploadSuccededEvent = new EventEmitter<any>();

  public photos: any[] = [];

  constructor(private cameraService: CameraService) {}

  ngOnInit() {}

  takePhotoAndUpload() {
    this.cameraService
      .takePhotoAndUpload(
        "/incident-report?incidentReportId=" + this.incidentReport.id,
        this.photos.length
      )
      .then((result) => {
        if (result) this.uploadSuccededEvent.emit();
      })
      .catch(() => {
        // This is taken care of in takePhotoAndUpload()
      });
  }
}
