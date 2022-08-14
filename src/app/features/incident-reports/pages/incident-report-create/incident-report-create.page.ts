import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Division } from "@app/models/division";
import { DivisionService } from "@app/services/division.service";
import { IncidentCategoryService } from "../../services/incident-category.service";
import {
  IncidentCategory,
  IncidentCategoryMappingTable,
} from "../../models/incident-category";
import { IncidentType } from "../../models/incident-type";
import { IncidentReportService } from "@app/services/incident-report.service";
import { ToastService } from "@app/services/toast.service";
import { IncidentReportFormType } from "../../models/incident-report";
import {debounceTime, distinctUntilChanged, map, takeUntil} from "rxjs/operators";
import {FormBuilderService} from "../../../form-builder/services/form-builder.service";
import {FormHelperService} from "../../../form-builder/services/form-helper.service";
import {HrFormType} from "../../../form-builder/models/hr-form";
import {Subject} from "rxjs";

@Component({
  selector: "app-incident-report-create",
  templateUrl: "incident-report-create.page.html",
  styleUrls: ["./incident-report-create.page.scss"],
})
export class IncidentReportCreatePage implements OnInit {
  public incidentForm: FormGroup;
  public formType: string = "Default";

  public incidentTypes: IncidentType[];
  public incidentCategories: IncidentCategory[];
  public mappingsTable: IncidentCategoryMappingTable;

  public divisions: Division[];
  public currentIncidentCategory: IncidentCategory;
  public currentIncidentTypes: IncidentType[];


  customFormSection = this.formBuilder.control(null);
  private unsub$ = new Subject();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private incidentReportService: IncidentReportService,
    private toastService: ToastService,
    private incidentCategoryService: IncidentCategoryService,
    private divisionService: DivisionService,
    private fbs: FormBuilderService,
    private fbh: FormHelperService
  ) {
    this.incidentForm = this.formBuilder.group({
      description: ["", Validators.required],
      other: [""],
      nearMiss: [false],
      divisionIds: [null, Validators.required],
      address: [""],
      city: [""],
      startDate: [new Date().toISOString(), Validators.required],
      endDate: [new Date().toISOString(), Validators.required],
      createdDate: [new Date().toISOString(), Validators.required],
      latitude: ["", Validators.required],
      longitude: ["", Validators.required],
      incidentTypeId: [null, Validators.required],
      incidentCategoryId: [null, Validators.required],
      countryId: [""],
      persons: [],
      vehicles: [],
      incidentReportUsers: [[]], // Ids
      customField1: [],
      customField2: [],
      customField3: [],
      customField4: [],
      customField5: [],
      customField6: [],
      customField7: [],
    });
  }

  ngOnInit() {
    this.getDataToPopulateForm();
    // Use this when testing -> this.subscribeToIncidentReportChanges();

    this.loadCustomFormTemplateIfExistsAndResetIds();
  }

  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  private getDataToPopulateForm() {
    this.listDivisions();
    this.listIncidentTypesAndCategories();
    this.listCategoryMappings();
  }

  public submitForm() {
    if (this.incidentForm.valid && this.customFormSection.valid) {
       this.createCustomFormIfExists().then(id => {
        this.insertIncidentReport(id);
      })

    }
  }

  private insertIncidentReport(customFormId: string) {
    this.incidentReportService.insert({...this.incidentForm.value, customFormId: customFormId}).then((id) => {
      this.navigateToNewReport(id);
    });
  }

  private navigateToNewReport(id: string) {
    this.router.navigate(["/tabs/tab2/details/" + id + "/0"]).then(() => {
      this.toastService.show("New incident report created!");
    });
  }

  private listDivisions(): void {
    this.divisionService.list().then((divisions) => {
      this.divisions = divisions;
    });
  }

  private listCategoryMappings() {
    this.incidentCategoryService.getMappings().then((mappingsTable) => {
      this.mappingsTable = mappingsTable;

      this.subscribeToCategoryChanges();
    });
  }

  private subscribeToCategoryChanges() {
    this.incidentForm.controls["incidentCategoryId"].valueChanges.subscribe(
      (categoryId) => {
        this.currentIncidentTypes = [];
        if (categoryId) {
          this.currentIncidentCategory = this.incidentCategories.find(
            (i) => i.id == categoryId
          );
          this.currentIncidentTypes = this.currentIncidentCategory.incidentTypes;
          this.formType = this.mappingsTable.mappings.find(
            (m) => m.incidentCategoryId == this.currentIncidentCategory.id
          ).form;
        }
      }
    );
  }

  private listIncidentTypesAndCategories(): void {
    this.incidentTypes = [];
    this.incidentCategoryService.list(true).then((data) => {
      this.incidentCategories = data;
      this.incidentTypes = this.incidentCategoryService.listIncidentTypes(data);
    });
  }

  public onSubmission() {
    this.submitForm();
  }

  divisionsChanged(data) {
    if (data) {
      this.incidentForm.get("divisionIds").setValue(data);
    }
  }


  private loadCustomFormTemplateIfExistsAndResetIds() {
    this.fbs
        .getOrgIncidentTemplate()
        .pipe(
            map(this.fbh.resetAllIdsButKeepRefs),
            map(this.fbh.setFormDtoType(HrFormType['Incident Report'])),
            takeUntil(this.unsub$)
        )
        .subscribe(x => {
          this.customFormSection.setValue(x ? x : null, { emitEvent: false });
          this.customFormSection.setValidators(x ? Validators.required : null);
          this.customFormSection.updateValueAndValidity({ emitEvent: false });
        });
  }

  private async createCustomFormIfExists() {
    if (this.customFormSection.value) {
      return await this.fbs.createFormInstance(this.customFormSection.value).toPromise();
    }
    else return null;
  }

}
