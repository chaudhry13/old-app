import { Component, OnInit, OnDestroy } from "@angular/core";
import { IncidentReportService } from "../_services/incident-report.service";
import { IncidentReport } from "../_models/incident-report";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { distinctUntilChanged, debounceTime } from "rxjs/operators";
import { LoadingController, ModalController } from "@ionic/angular";
import { IncidentReportFilterPage } from "./incident-report-filter/incident-report-filter.page";

@Component({
  selector: "app-incident-report-page",
  templateUrl: "incident-report.page.html",
  styleUrls: ["incident-report.page.scss"]
})
export class IncidentReportPage implements OnInit {
  public incidentReports: IncidentReport[] = [];
  public infScrollincidentReports: IncidentReport[] = [];
  public incidentReportMaxLength: number;
  public incidentFilterForm: FormGroup;

  public startDate: Date;
  public endDate: Date;

  public loadingOverlay: any;
  public pageNumber: number = 1;

  constructor(
    public incidentReportService: IncidentReportService,
    public loadingController: LoadingController,
    private formBuilder: FormBuilder,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.startDate = new Date();
    this.endDate = new Date();
    this.startDate.setMonth(this.startDate.getMonth() - 1);
    this.endDate.setMonth(this.endDate.getMonth() + 1);

    this.incidentFilterForm = this.formBuilder.group({
      startDate: [this.startDate.toJSON()],
      endDate: [this.endDate.toJSON()],
      incidentCategoryIds: [""],
      incidentTypeIds: [""],
      riskLevels: [""],
      divisionIds: [""],
      countryIds: [""],
      internal: [true],
      external: [true],
      southWestLatitude: [0, Validators.required],
      southWestLongitude: [0, Validators.required],
      northEastLatitude: [0, Validators.required],
      northEastLongitude: [0, Validators.required]
    });
  }

  ionViewWillEnter() {
    this.list(this.incidentFilterForm.value);
  }

  loadData(event) {
    setTimeout(() => {
      this.addToInfScrollList();
      event.target.complete();

      if (this.infScrollincidentReports.length >= this.incidentReportMaxLength) {
        event.target.disabled = true;
      }
    }, 500)
  }

  addToInfScrollList() {
    this.incidentReports.slice((this.pageNumber - 1) * 25, (25 * this.pageNumber)).forEach(incident => {
      this.infScrollincidentReports.push(incident);
    });
    this.pageNumber++;
  }

  async list(filter: any) {
    this.incidentReports = null;
    this.infScrollincidentReports = [];
    this.pageNumber = 1;

    this.incidentReportService.list(filter).then(incidentReports => {
      this.incidentReports = incidentReports.data;

      this.incidentReports.forEach(incidentReport => {
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
        'form': this.incidentFilterForm
      }
    });

    modal.onDidDismiss().then(data => {
      this.incidentFilterForm = data.data;
      this.list(data.data.value);
    });

    return await modal.present();
  }

  setFallbackIcon(incidentReport) {
    incidentReport.icon = '/assets/img/incident-reports/other_i.png';
  }
}
