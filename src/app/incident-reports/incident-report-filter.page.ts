import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Division } from "../_models/division";
import { DivisionService } from "../_services/division.service";
import { Country } from '../_models/country';
import { IncidentCategory } from '../_models/incident-category';
import { IncidentType } from '../_models/incident-type';
import { IncidentCategoryService } from '../_services/incident-category.service';

@Component({
  selector: "app-incident-report-filter-page",
  templateUrl: "incident-report-filter.page.html",
  styleUrls: ["incident-report-filter.page.scss"]
})
export class IncidentReportFilterPage implements OnInit {
  @Input() form: FormGroup;

  filterForm: FormGroup;

  divisions: Division[];
  countries: Country[];
  incidentCategories: IncidentCategory[];
  incidentTypes: IncidentType[];

  constructor(private modal: ModalController, public incidentCategoryService: IncidentCategoryService, public divisionService: DivisionService, public formBuilder: FormBuilder) {

    this.filterForm = this.formBuilder.group({
      startDate: [new Date().toJSON()],
      endDate: [new Date().toJSON()],
      incidentCategoryIds: [""],
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

  ngOnInit() {
    this.divisionService.list().then(divisions => {
      this.divisions = divisions;
      var divisionIds: string[] = this.divisions.map(x => x.id);
      this.filterForm.controls.divisionIds.setValue(divisionIds);
    });

    this.incidentCategoryService.list(true).then(categories => {
      this.incidentCategories = categories;
    });

    this.filterForm = this.form;

    let startDate = this.form.controls.startDate.value;
    let endDate = this.form.controls.endDate.value;

    this.filterForm.controls.startDate.setValue(startDate);
    this.filterForm.controls.endDate.setValue(endDate);
  }


  dismiss() {
    this.modal.dismiss(this.filterForm);
  }
}
