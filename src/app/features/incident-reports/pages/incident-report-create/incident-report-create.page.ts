import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Division } from '@app/models/division';
import { DivisionService } from '@app/services/division.service';
import { IncidentCategoryService } from '@app/services/incident-category.service';
import { IncidentCategory, IncidentCategoryMappingTable } from '@app/models/incident-category';
import { IncidentType } from '@app/models/incident-type';
import { IncidentReportService } from '@app/services/incident-report.service';
import { ToastService } from '@app/services/toast.service';
import { IncidentReportFormType } from '@app/models/incident-report';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-incident-report-create',
  templateUrl: 'incident-report-create.page.html',
  styleUrls: ['./incident-report-create.page.scss']
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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private incidentReportService: IncidentReportService,
    private toastService: ToastService,
    private incidentCategoryService: IncidentCategoryService,
    private divisionService: DivisionService) {
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
      customField7: []
    });
  }

  ngOnInit() {
    this.getDataToPopulateForm();
    // Use this when testing -> this.subscribeToIncidentReportChanges();
  }

  private getDataToPopulateForm() {
    this.listDivisions();
    this.listIncidentTypesAndCategories();
    this.listCategoryMappings();
  }

  private subscribeToIncidentReportChanges() {
    this.incidentForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(form => {
        console.log(form);
      });
  }

  public submitForm() {
    if (this.incidentForm.valid) {
      this.insertIncidentReport();
    }
  }

  private insertIncidentReport() {
    this.incidentReportService.insert(this.incidentForm.value).then(id => {
      this.navigateToNewReport(id);
    });
  }

  private navigateToNewReport(id: string) {
    this.router.navigate(["/tabs/tab2/details/" + id + "/0"]).then(() => {
      this.toastService.show("New incident report created!");
    });
  }

  private listDivisions(): void {
    this.divisionService.list().then(divisions => {
      this.divisions = divisions;
    });
  }

  private listCategoryMappings() {
    this.incidentCategoryService.getMappings().then(mappingsTable => {
      this.mappingsTable = mappingsTable;

      this.subscribeToCategoryChanges();
    });
  }

  private subscribeToCategoryChanges() {
    this.incidentForm.controls["incidentCategoryId"].valueChanges.subscribe(categoryId => {
      this.currentIncidentTypes = [];
      if (categoryId) {
        this.currentIncidentCategory = this.incidentCategories.find(i => i.id == categoryId);
        this.currentIncidentTypes = this.currentIncidentCategory.incidentTypes;
        this.formType = this.mappingsTable.mappings.find(m => m.incidentCategoryId == this.currentIncidentCategory.id).form;
      }
    });
  }

  private listIncidentTypesAndCategories(): void {
    this.incidentTypes = [];
    this.incidentCategoryService.list(true).then(data => {
      this.incidentCategories = data;
      this.incidentTypes = this.incidentCategoryService.listIncidentTypes(data);
    });
  }

  public onSubmission() {
    this.submitForm();
  }

  divisionsChanged(data) {
    if (data) {
      this.incidentForm.get('divisionIds').setValue(data);
    }
  }
}