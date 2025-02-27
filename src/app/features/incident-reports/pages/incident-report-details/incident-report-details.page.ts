import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IncidentReport } from "../../models/incident-report";
import { IncidentReportService } from "@app/services/incident-report.service";
import { CameraService } from "@app/services/photo.service";
import { User } from "@app/models/user";
import { AgmMap } from "@agm/core";
import { IncidentCategoryService } from "../../services/incident-category.service";
import { IncidentCategoryMappingTable } from "../../models/incident-category";
import {FormDto} from "../../../form-builder/models/form.dto";
import {FormBuilderService} from "../../../form-builder/services/form-builder.service";
import {
  BuildingComponentType,
  BuildingComponent,
  BuildingComponentUnion
} from "../../../form-builder/models/building-components/building-component";

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

  formDto: FormDto;

  constructor(
    public activatedRoute: ActivatedRoute,
    public incidentReportService: IncidentReportService,
    public cameraService: CameraService,
    public incidentCategoryService: IncidentCategoryService,
    private fbs: FormBuilderService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.source = this.activatedRoute.snapshot.paramMap.get("source");
  }

  ngOnInit() {
    this.renderMap = false;
    this.getIncidentReport();
  }

  loadForm(id: string) {
    if(!id)return;
    this.fbs.get(id).subscribe(form => {
      this.formDto = form;
    });
  }

  parse(bc: BuildingComponentUnion) {
    const options: any = BuildingComponent.childFieldsFactory(bc)[1];
    return options.value;
  }

  ionViewDidEnter() {
    this.renderMap = true;
  }

  private getIncidentReport() {
    this.incidentReportService
      .get(this.id, this.source)
      .then((incidentReport) => {
        this.incidentReport = incidentReport;
        this.loadForm(incidentReport?.customFormId);
        this.listCategoryMappings();
      });
  }

  private listCategoryMappings() {
    this.incidentCategoryService.getMappings().then((mappingsTable) => {
      this.mappingsTable = mappingsTable;
      this.formType = this.getFormType(mappingsTable);
    });
  }

  private getFormType(mappingsTable: IncidentCategoryMappingTable): string {
    return mappingsTable.mappings.find(
      (m) => m.incidentCategoryId == this.incidentReport?.incidentCategory?.id
    ).form;
  }
}
