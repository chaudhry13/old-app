import { Component, EventEmitter, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IncidentReport } from "../../../incident-reports/models/incident-report";
import { IncidentReportService } from "@shared/services/incident-report.service";
import { Division } from "@app/models/division";
import { ActivityLogService } from "../../services/activity-log-service";
import { NavController } from "@ionic/angular";
import { ToastService } from "@app/services/toast.service";
import { ActivityType } from "../../models/activity-type";

@Component({
  selector: "app-activity-log",
  templateUrl: "./activity-creation-page.component.html",
  styleUrls: ["./activity-creation-page.component.scss"],
})
export class ActivityCreationPage implements OnInit {

  public today = new Date();
  public activityForm: FormGroup;
  public activityTypes: ActivityType[];

  public incidentReports: IncidentReport[];
  public divisionsWithManagers: Division[];
  public activityId: string;
  public updateFiles = new EventEmitter<any>();

  constructor(public formBuilder: FormBuilder,
              public incidentReportService: IncidentReportService,
              public activityLogService: ActivityLogService,
              public navController: NavController,
              public toastService: ToastService) { }

  ngOnInit() {
    this.activityForm = this.formBuilder.group({
      activityId: [this.activityId, Validators.required],
      divisionId: [null, Validators.required],
      eventTime: [new Date().toISOString()],
      activityTypeId: [null, Validators.required],
      description: ["", Validators.required],
      specifiedUser: [""],
      latitude: [""],
      longitude: [""],
      address: [""],
      countryId: [""],
      linkedIncidentReportId: [null]
    });

    this.activityLogService.getActivityTypes().then(activityTypes => {
      this.activityTypes = activityTypes;
    });

    this.activityLogService.getActivityGuid().then(id => {
      this.activityId = id;
      this.activityForm.get("activityId").setValue(id);
    });

    this.activityLogService.getDivisionsWithManagers().then(divisions => {
      this.divisionsWithManagers = divisions;
    });

    this.getIncidentReports();
  }

  private getIncidentReports() {
    const oneYearBack = new Date();
    oneYearBack.setFullYear(oneYearBack.getFullYear() - 1);

    const incidentReportFilter = this.formBuilder.group({
      startDate: [oneYearBack],
      endDate: [new Date()],
      internal: [true],
      external: [false]
    });

    this.incidentReportService.list(incidentReportFilter.value).then(list => {
      this.incidentReports = list.data;
    });
  }

  createActivity(): void {
    this.activityLogService.createActivity(this.activityForm).then(() => {
      this.navController.navigateRoot("tabs/tab2").then(() => {
        this.toastService.show("Activity is saved!");
      });
    });
  }

  uploadSuccess() {
    this.updateFiles.emit();
  }
}
