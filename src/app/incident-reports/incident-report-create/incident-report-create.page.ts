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
  public reportFormType: IncidentReportFormType = IncidentReportFormType.Investigation;
  public incidentReportFormType: typeof IncidentReportFormType = IncidentReportFormType;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private incidentReportService: IncidentReportService,
    private toastService: ToastService) {
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
    this.incidentForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(form => {
        console.log(form);
      })
  }

  public submitForm() {
    if (this.incidentForm.valid) {
      this.incidentReportService.insert(this.incidentForm.value).then(id => {
        this.router.navigate(["/tabs/tab2/details/" + id + "/0"]).then(() => {
          this.toastService.show("New incident report created!");
        });
      });
    }
  }

  public onSubmission() {
    this.submitForm();
  }
}