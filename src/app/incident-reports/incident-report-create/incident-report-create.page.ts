import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Division } from 'src/app/_models/division';
import { DivisionService } from 'src/app/_services/division.service';
import { IncidentCategoryService } from 'src/app/_services/incident-category.service';
import { IncidentCategory } from 'src/app/_models/incident-category';
import { IncidentType } from 'src/app/_models/incident-type';
import { ModalController } from '@ionic/angular';
import { LocationModalPage } from 'src/app/modals/location-modal.page';
import { GeocodingService } from 'src/app/_services/geocoding.service';
import { ToastController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IncidentReportService } from 'src/app/_services/incident-report.service';
import { CountryService } from 'src/app/_services/country.service';
import { Country } from 'src/app/_models/country';
import { ToastService } from 'src/app/_services/toast.service';
import { IncidentReportFormType } from 'src/app/_models/incident-report';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-incident-report-create',
  templateUrl: 'incident-report-create.page.html',
  styleUrls: ['./incident-report-create.page.scss']
})

export class IncidentReportCreatePage implements OnInit {
  public incidentForm: FormGroup;
  public reportFormType: IncidentReportFormType = null;
  public incidentReportFormType: typeof IncidentReportFormType = IncidentReportFormType;

  public incidentTypes: IncidentType[];
  public incidentCategories: IncidentCategory[];

  public isIntelligenceReportSelected = false;

  public divisions: Division[];
  public currentIncidentCategory: IncidentCategory;
  public currentIncidentType: IncidentType;

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
      resultingActions: [""],
      actions: [""]
    });
  }

  ngOnInit() {
    this.getDataToPopulateForm();
    this.subscribeToIncidentReportChanges();
    this.subscribeToIncidentTypeChanges();
  }

  private getDataToPopulateForm() {
    this.listDivisions();
    this.listIncidentTypesAndCategories();
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

  private subscribeToIncidentTypeChanges() {
    this.incidentForm.controls["incidentTypeId"].valueChanges.subscribe(incidentTypeid => {
      if (incidentTypeid) {
        var incidentType: IncidentType = this.incidentTypes.find(i => i.id == incidentTypeid);
        this.currentIncidentCategory = this.incidentCategoryService.getIncidentCategoryFrom(incidentType, this.incidentCategories);
        this.incidentForm.controls["incidentCategoryId"].setValue(this.currentIncidentCategory.id);
        this.isIntelligenceReportSelected = incidentType.name == "Intelligence Report";
      }
    });
  }

  private listIncidentTypesAndCategories(): void {
    this.incidentTypes = [];
    this.incidentCategoryService.list(true).then(data => {
      this.incidentCategories = data;

      // TODO: Remove this at some point before production
      this.addTestData();

      this.incidentTypes = this.incidentCategoryService.listIncidentTypes(data);
    });
  }

  public onSubmission() {
    this.submitForm();
  }

  private addTestData() {
    var cat: IncidentCategory = {
      id: 1337,
      name: "Observation",
      incidentTypes: []
    };
    var type: IncidentType = {
      id: 1337,
      name: "Intelligence Report",
      incidentCategory: cat
    };

    cat.incidentTypes.push(type);
    this.incidentCategories.push(cat);
  }
}