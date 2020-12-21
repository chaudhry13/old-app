import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IncidentReport } from "src/app/features/incident-reports/models/incident-report";
import { CameraService } from "src/app/core/services/photo.service";
import { AppConfigService } from "@app/services/auth-config.service";

@Component({
  selector: "upload-photo-button",
  templateUrl: "./upload-photo-button.component.html",
  styleUrls: ["./upload-photo-button.component.scss"],
})
export class UploadPhotoButtonComponent implements OnInit {
  @Input() id: string;
  @Output() uploadSuccessEvent = new EventEmitter<any>();

  public photos: any[] = [];

  constructor(private cameraService: CameraService,
              private appConfigService: AppConfigService) {}

  ngOnInit() {}

  takePhotoAndUpload() {
    this.cameraService
      .takePhotoAndUpload(
        "/activity-log/activity?organizationId=" + this.appConfigService.organizationId + "&activityId=" + this.id,
        this.photos.length
      )
      .then((result) => {
        if (result) { this.uploadSuccessEvent.emit(); }
      })
      .catch(() => {
        // This is taken care of in takePhotoAndUpload()
      });
  }
}
