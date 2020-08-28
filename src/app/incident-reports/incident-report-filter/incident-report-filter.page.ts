import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Division } from "../../_models/division";
import { DivisionService } from "../../_services/division.service";
import { Country } from '../../_models/country';
import { IncidentCategory } from '../../_models/incident-category';
import { IncidentType } from '../../_models/incident-type';
import { IncidentCategoryService } from '../../_services/incident-category.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: "app-incident-report-filter-page",
  templateUrl: "incident-report-filter.page.html",
  styleUrls: ["incident-report-filter.page.scss"]
})
export class IncidentReportFilterPage implements OnInit {
  @Input() filterForm: FormGroup;

  divisions: Division[];
  countries: Country[];
  incidentCategories: IncidentCategory[];
  incidentTypes: IncidentType[];

  constructor(private modal: ModalController,
    public incidentCategoryService: IncidentCategoryService,
    public divisionService: DivisionService,
    public formBuilder: FormBuilder) {
    this.filterForm = this.formBuilder.group({
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
    this.listDivisions();
    this.listCategories();

    this.setStartEndDate();

    this.filterForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((form) => {
        console.log(form);
      })
  }

  private listDivisions() {
    this.divisionService.list().then(divisions => {
      this.divisions = divisions;
    });
  }

  private listCategories() {
    this.incidentCategoryService.list(true).then(categories => {
      this.incidentCategories = categories;
      this.incidentTypes = this.incidentCategoryService.listIncidentTypes(categories);
    });
  }

  private setStartEndDate() {
    let startDate = this.filterForm.controls.startDate.value;
    let endDate = this.filterForm.controls.endDate.value;

    this.filterForm.controls.startDate.setValue(startDate);
    this.filterForm.controls.endDate.setValue(endDate);
  }

  divisionsChanged(data) {
    if (data) {
      this.filterForm.get('divisionIds').setValue(data);
    }
  }

  dismiss() {
    this.modal.dismiss(this.filterForm);
  }
}
