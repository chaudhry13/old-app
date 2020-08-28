import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IncidentReport } from "src/app/_models/incident-report";
import { IncidentReportService } from "src/app/_services/incident-report.service";
import { StorageService } from "src/app/_services/storage.service";
import { Attachment } from "src/app/_models/file";
import { ToastService } from "src/app/_services/toast.service";
import { CameraService } from "src/app/_services/photo.service";
import { AppConfigService } from "src/app/_services/auth-config.service";
import {
  FileTransferObject,
  FileTransfer,
} from "@ionic-native/file-transfer/ngx";
import { User } from "src/app/_models/user";
import { AlertController } from "@ionic/angular";
import { AgmMap, AgmMarker } from "@agm/core";

@Component({
  selector: "app-incident-report-details",
  templateUrl: "./incident-report-details.page.html",
  styleUrls: ["./incident-report-details.page.scss"],
})
export class IncidentReportDetailsPage implements OnInit {
  @ViewChild("map") myMap: AgmMap;

  private id: string;
  private source: any;

  public incidentReport: IncidentReport;

  user: User;

  renderMap: boolean = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public incidentReportService: IncidentReportService,
    private storageService: StorageService,
    private toastService: ToastService,
    public cameraService: CameraService,
    private appConfigService: AppConfigService,
    public fileTransfer: FileTransfer,
    private alertCtrl: AlertController
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.source = this.activatedRoute.snapshot.paramMap.get("source");
  }

  ngOnInit() {
    this.renderMap = false;
    this.incidentReportService
      .get(this.id, this.source)
      .then((incidentReport) => {
        this.incidentReport = incidentReport;
      });
  }

  ionViewDidEnter() {
    this.renderMap = true;
  }
}
