import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IncidentReport } from "src/app/_models/incident-report";
import { IncidentReportService } from "src/app/_services/incident-report.service";
import { CameraService } from "src/app/_services/photo.service";
import {
  FileTransfer,
} from "@ionic-native/file-transfer/ngx";
import { User } from "src/app/_models/user";
import { AgmMap } from "@agm/core";
import { IncidentCategoryService } from 'src/app/_services/incident-category.service';
import { IncidentCategoryMappingTable } from 'src/app/_models/incident-category';

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
  public user: User;
  public renderMap: boolean = false;
  public mappingsTable: IncidentCategoryMappingTable;
  public formType: string = "Default";

  constructor(
    public activatedRoute: ActivatedRoute,
    public incidentReportService: IncidentReportService,
    public cameraService: CameraService,
    public fileTransfer: FileTransfer,
    public incidentCategoryService: IncidentCategoryService) {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.source = this.activatedRoute.snapshot.paramMap.get("source");
  }

  ngOnInit() {
    this.renderMap = false;
    this.getIncidentReport();
  }

  ionViewDidEnter() {
    this.renderMap = true;
  }

  private getIncidentReport() {
    this.incidentReportService
      .get(this.id, this.source)
      .then((incidentReport) => {
        this.incidentReport = incidentReport;
        this.listCategoryMappings();
      });
  }

  private listCategoryMappings() {
    this.incidentCategoryService.getMappings().then(mappingsTable => {
      this.mappingsTable = mappingsTable;
      console.log(mappingsTable);
      this.formType = this.getFormType(mappingsTable);
    });
  }

  private getFormType(mappingsTable: IncidentCategoryMappingTable): string {
    return mappingsTable.mappings.find(m => m.incidentCategoryId == this.incidentReport.incidentCategory.id).form;
  }
}
