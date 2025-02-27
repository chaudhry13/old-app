import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Division } from "@app/models/division";
import { DivisionService } from "@app/services/division.service";
import { Country } from "@shared/models/country";
import {
  IncidentCategory,
  IncidentCategoryMappingTable,
} from "../../models/incident-category";
import { IncidentType } from "../../models/incident-type";
import { IncidentCategoryService } from "../../services/incident-category.service";
import { distinctUntilChanged } from "rxjs/operators";
import { CountryService } from "@app/services/country.service";

@Component({
  selector: "app-incident-report-filter-page",
  templateUrl: "incident-report-filter.page.html",
  styleUrls: ["incident-report-filter.page.scss"],
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

  constructor(
    private modal: ModalController,
    public incidentCategoryService: IncidentCategoryService,
    public divisionService: DivisionService,
    public formBuilder: FormBuilder,
    private countryService: CountryService
  ) {}

  ngOnInit() {
    this.listViewData().then(() => {
      this.filterForm = this.form;
      this.setFilters(this.filterForm.get("incidentCategoryIds").value);
      this.subscribeToCategoryChanges();
    });
  }

  private subscribeToCategoryChanges() {
    this.filterForm.controls.incidentCategoryIds.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.setFilters(value);
      });
  }

  private setFilters(categoryIds: any[]) {
    if (categoryIds) {
      let ids = categoryIds as number[];
      this.filters = this.mappingTable.mappings
        .filter((m) => ids.some((id) => id == m.incidentCategoryId))
        .map((m) => m.form);
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
    this.incidentTypes = this.incidentCategoryService.listIncidentTypes(
      this.incidentCategories
    );
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

  divisionsChanged(data) {
    if (data) {
      this.filterForm.get("divisionIds").setValue(data);
    }
  }

  dismiss() {
    this.modal.dismiss(this.filterForm);
  }
}
