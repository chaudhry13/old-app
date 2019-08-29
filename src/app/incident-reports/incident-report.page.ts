import { Component, OnInit, OnDestroy } from "@angular/core";
import { IncidentReportService } from "../_services/incident-report.service";
import { IncidentReport } from "../_models/incident-report";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { distinctUntilChanged, debounceTime } from "rxjs/operators";
import { LoadingController, ModalController } from "@ionic/angular";
import { IncidentReportFilterPage } from "./incident-report-filter.page";

@Component({
	selector: "app-incident-report-page",
	templateUrl: "incident-report.page.html",
	styleUrls: ["incident-report.page.scss"]
})
export class IncidentReportPage implements OnInit {
	public incidentReports: IncidentReport[];
	public incidentFilterForm: FormGroup;

	public startDate: Date = new Date();

	public loadingOverlay: any;

	constructor(
		public incidentReportService: IncidentReportService,
		public loadingController: LoadingController,
		private formBuilder: FormBuilder,
		public modalController: ModalController
	) { }

	ngOnInit() {
		this.startDate.setDate(this.startDate.getDay() - 7);

		this.incidentFilterForm = this.formBuilder.group({
			startDate: [this.startDate],
			endDate: [new Date()],
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

		this.list(this.incidentFilterForm.value);
	}

	async list(filter: any) {
		this.incidentReports = null;

		this.incidentReportService.list(filter).then(incidentReports => {
			setTimeout(() => {
				this.incidentReports = incidentReports.data;

				this.incidentReports.forEach(incidentReport => {
					incidentReport.icon = this.incidentReportService.getIcon(
						incidentReport.incidentCategory.name,
						incidentReport.source,
						incidentReport.riskLevel
					);
				});
			}, 1000);
		});
	}

	async filter() {
		const modal = await this.modalController.create({
			component: IncidentReportFilterPage,
			componentProps: {
				'form': this.incidentFilterForm,
				'test': "test"
			}
		});

		modal.onDidDismiss().then(data => {
			this.incidentFilterForm = data.data;

			this.list(data.data.value);
		});

		return await modal.present();
	}
}
