import { Component, OnInit, OnDestroy } from "@angular/core";
import { IncidentReportService } from "@shared/services/incident-report.service";
import { IncidentReport } from "../../models/incident-report";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { distinctUntilChanged, debounceTime } from "rxjs/operators";
import { LoadingController, ModalController, NavController } from "@ionic/angular";
import { IncidentReportFilterPage } from "../incident-report-filters/incident-report-filter.page";
import { ActivityLogService } from "../../../activity-log/services/activity-log-service";

@Component({
  selector: "app-incident-report-page",
  templateUrl: "incident-report.page.html",
  styleUrls: ["incident-report.page.scss"],
})
export class IncidentReportPage implements OnInit {
  public incidentReports: IncidentReport[] = [];
  public infScrollIncidentReports: IncidentReport[] = [];
  public incidentReportMaxLength: number;
  public incidentFilterForm: FormGroup;

  public pageNumber = 1;
  public showCreateActivity: boolean;

  constructor(
    public incidentReportService: IncidentReportService,
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    public navController: NavController,
    public activityLogService: ActivityLogService
  ) {
    this.incidentFilterForm = this.formBuilder.group({
      startDate: [new Date().toJSON()],
      endDate: [new Date().toJSON()],
      incidentCategoryIds: [""],
      incidentTypeIds: [""],
      description: [null],
      riskLevels: [""],
      divisionIds: [""],
      countryIds: [""],
      internal: [true],
      external: [true],
      southWestLatitude: [0, Validators.required],
      southWestLongitude: [0, Validators.required],
      northEastLatitude: [0, Validators.required],
      northEastLongitude: [0, Validators.required],

      apparel: [null],
      approxAgeMax: [null],
      approxAgeMin: [null],
      build: [null],
      gender: [null],
      heightMax: [null],
      heightMin: [null],
      identifyingfeatures: [null],
      incidentName: [null],
      obervationName: [null],
      email: [],

      vehicleDescription: [null],
      color: [null],
      colorOther: [null],
      make: [null],
      makeOther: [null],
      model: [null],
      modelOther: [null],
      vrm: [null],

      users: [[]],
      customField1: [null],
      customField2: [null],
      customField3: [null],
      customField4: [null],
      customField5: [null],
      customField6: [null],
      customField7: [null],
    });
  }

  ngOnInit() {
    this.setStartEndDates();
    this.activityLogService.getDivisionsWithManagers().then(divisions => {
      this.showCreateActivity = divisions.length !== 0;
    }).catch(reason => {
      this.showCreateActivity = false;
    });
  }

  private setStartEndDates() {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    endDate.setMonth(endDate.getMonth() + 1);
    this.incidentFilterForm.get("startDate").setValue(startDate.toJSON());
    this.incidentFilterForm.get("endDate").setValue(endDate.toJSON());
  }

  ionViewWillEnter() {
    this.list(this.incidentFilterForm.value);
  }

  loadData(event) {
    setTimeout(() => {
      this.addToInfScrollList();
      event.target.complete();

      if (
        this.infScrollIncidentReports.length >= this.incidentReportMaxLength
      ) {
        event.target.disabled = true;
      }
    }, 500);
  }

  addToInfScrollList() {
    this.incidentReports
      .slice((this.pageNumber - 1) * 25, 25 * this.pageNumber)
      .forEach((incident) => {
        this.infScrollIncidentReports.push(incident);
      });
    this.pageNumber++;
  }

  async list(filter: any) {
    this.incidentReports = null;
    this.infScrollIncidentReports = [];
    this.pageNumber = 1;

    this.incidentReportService.list(filter).then((incidentReports) => {
      this.incidentReports = incidentReports.data;

      this.incidentReports.forEach((incidentReport) => {
        incidentReport.icon = this.incidentReportService.getIcon(
          incidentReport.incidentCategory.name,
          incidentReport.source,
          incidentReport.riskLevel
        );
      });

      this.incidentReportMaxLength = incidentReports.data.length;
      this.addToInfScrollList();
    });
  }

  async filter() {
    const modal = await this.modalController.create({
      component: IncidentReportFilterPage,
      componentProps: {
        form: this.incidentFilterForm,
      },
    });

    modal.onDidDismiss().then((data) => {
      this.incidentFilterForm = data.data;
      this.list(data.data.value);
    });

    return await modal.present();
  }

  setFallbackIcon(incidentReport) {
    incidentReport.icon = "/assets/img/incident-reports/other_i.png";
  }

  goToCreateIncident(): void {
    this.navController.navigateForward("/tabs/tab2/create").then(() => {
      // TODO: on destroy
    });
  }

  goToCreateActivity() {
    this.navController.navigateForward("/tabs/tab2/activity-log").then(() => {
      // TODO: on destroy
    });
  }
}
