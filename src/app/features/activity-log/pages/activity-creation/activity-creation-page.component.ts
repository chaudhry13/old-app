import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IncidentReport } from "../../../incident-reports/models/incident-report";
import { IncidentReportService } from "@shared/services/incident-report.service";

@Component({
  selector: "app-activity-log",
  templateUrl: "./activity-creation-page.component.html",
  styleUrls: ["./activity-creation-page.component.scss"],
})
export class ActivityCreationPage implements OnInit {

  public today = new Date();
  public activityForm: FormGroup;

  public incidentReports: IncidentReport[];

  constructor(public formBuilder: FormBuilder,
              public incidentReportService: IncidentReportService) { }

  ngOnInit() {
    this.activityForm = this.formBuilder.group({
      divisionId: [null, Validators.required],
      eventTime: [new Date().toISOString()],
      description: ["", Validators.required],
      specifiedUser: [""],
      latitude: [""],
      longitude: [""],
      address: [""],
      countryId: [""],
      linkedIncidentReportId: [null]
    });

    this.activityForm.valueChanges.subscribe(change => {
      console.log(change);
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

  divisionsChanged(data) {
    if (data) {
      // TODO: This should be a single picker for one division
      this.activityForm.get("divisionId").setValue(data[0]);
    }
  }

  createActivity(): void {
    console.log(this.activityForm.value);
  }
}
