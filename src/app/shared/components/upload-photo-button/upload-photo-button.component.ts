import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IncidentReport } from "src/app/features/incident-reports/models/incident-report";
import { CameraService } from "src/app/core/services/photo.service";
import { AppConfigService } from "@app/services/app-config.service";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "upload-photo-button",
  templateUrl: "./upload-photo-button.component.html",
  styleUrls: ["./upload-photo-button.component.scss"],
})
export class UploadPhotoButtonComponent implements OnInit {
  @Input() id: string;
  @Output() uploadSuccessEvent = new EventEmitter<any>();

  public photos: any[] = [];

  constructor(
    private cameraService: CameraService,
    private auth: AuthService
  ) {}

  ngOnInit() {}

  takePhotoAndUpload() {
    this.cameraService
      .takePhotoAndUpload(
        "/activity-log/activity?organizationId=" +
          this.auth.user.organization +
          "&activityId=" +
          this.id,
        this.photos.length
      )
      .then((result) => {
        if (result) {
          this.uploadSuccessEvent.emit();
        }
      })
      .catch(() => {
        // This is taken care of in takePhotoAndUpload()
      });
  }
}
