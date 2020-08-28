import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Division } from "../../_models/division";
import { DivisionService } from "../../_services/division.service";
import { Country } from '../../_models/country';
import { IncidentCategory, IncidentCategoryMappingTable } from '../../_models/incident-category';
import { IncidentType } from '../../_models/incident-type';
import { IncidentCategoryService } from '../../_services/incident-category.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CountryService } from 'src/app/_services/country.service';

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
  mappingTable: IncidentCategoryMappingTable;
  filters: string[] = [];

  constructor(private modal: ModalController,
    public incidentCategoryService: IncidentCategoryService,
    public divisionService: DivisionService,
    public formBuilder: FormBuilder,
    private countryService: CountryService) {
  }

  ngOnInit() {
    this.listDivisions();
    this.listCategories();
    this.listCountries();

    this.setStartEndDate();

    this.incidentCategoryService.getMappings().then(mappings => {
      this.mappingTable = mappings;
    });

    this.filterForm.controls.incidentCategoryIds.valueChanges.subscribe(value => {
      let ids = <number[]>value;
      this.filters = this.mappingTable.mappings.filter(m => ids.some(id => id == m.incidentCategoryId)).map(m => m.form);
    });
  }

  ionViewDidLoad() {
    this.filterForm.patchValue(this.filterForm.value);
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

  private listCountries() {
    this.countryService.list().subscribe(countries => {
      this.countries = countries;
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
