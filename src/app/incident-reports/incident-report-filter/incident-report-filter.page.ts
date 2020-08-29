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
import { resolve } from 'dns';

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
  mappingTable: IncidentCategoryMappingTable;
  filters: string[] = [];

  constructor(private modal: ModalController,
    public incidentCategoryService: IncidentCategoryService,
    public divisionService: DivisionService,
    public formBuilder: FormBuilder,
    private countryService: CountryService) {
  }

  ngOnInit() {
    this.listViewData().then(() => {
      this.filterForm = this.form;
      this.setFilters(this.filterForm.get("incidentCategoryIds").value);
      this.setStartEndDate();
      this.subscribeToCategoryChanges();
    });

  }

  private subscribeToCategoryChanges() {
    this.filterForm.controls.incidentCategoryIds.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(value => {
        this.setFilters(value);
      });
  }

  private setFilters(categoryIds: any[]) {
    if (categoryIds) {
      let ids = <number[]>categoryIds;
      this.filters = this.mappingTable.mappings.filter(m => ids.some(id => id == m.incidentCategoryId)).map(m => m.form);
    }
  }

  private async setMappings(): Promise<IncidentCategoryMappingTable> {
    return this.incidentCategoryService.getMappings();
  }

  ionViewDidLoad() {
    this.filterForm.patchValue(this.filterForm.value);
  }

  private async listViewData(): Promise<any> {
    this.mappingTable = await this.setMappings();
    this.divisions = await this.listDivisions();
    this.incidentCategories = await this.listCategories();
    this.countries = await this.listCountries();
    this.incidentTypes = this.incidentCategoryService.listIncidentTypes(this.incidentCategories);
  }

  private async listDivisions(): Promise<Division[]> {
    return this.divisionService.list();
  }

  private async listCategories(): Promise<IncidentCategory[]> {
    return this.incidentCategoryService.list(true);
  }

  private async listCountries(): Promise<Country[]> {
    return this.countryService.list().toPromise();
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
