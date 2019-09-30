import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Division } from 'src/app/_models/division';
import { DivisionService } from 'src/app/_services/division.service';
import { IncidentCategoryService } from 'src/app/_services/incident-category.service';
import { IncidentCategory } from 'src/app/_models/incident-category';
import { IncidentType } from 'src/app/_models/incident-type';
import { ModalController } from '@ionic/angular';
import { LocationModalPage } from 'src/app/modals/location-modal.page';

@Component({
  selector: 'app-incident-report-create',
  templateUrl: 'incident-report-create.page.html',
  styleUrls: ['./incident-report-create.page.scss']
})

export class IncidentReportCreatePage implements OnInit {
  public incidentForm: FormGroup;
  public divisions: Division[];
  public incidentCategories: IncidentCategory[];
  public incidentTypes: IncidentType[];

  public incidentCategory: IncidentCategory;

  public healthAndSafety: boolean;

  constructor(public activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public divisionService: DivisionService,
    public incidentCategoryService: IncidentCategoryService,
    private modalController: ModalController) {
    this.incidentForm = this.formBuilder.group({
      divisionIds: [null, Validators.required],
      incidentTypeId: [null, Validators.required],
      incidentCategoryId: [null, Validators.required],
      description: [""],
      latitude: ["", Validators.required],
      longitude: ["", Validators.required],
      address: [""],
      city: [""],
      country: [""],
      startDate: [new Date().toISOString(), Validators.required],
      nearMiss: [false]
    });
  }

  ngOnInit() {
    // List divisions
    this.divisionService.list().then(divisions => {
      this.divisions = divisions;
    });

    // On incident type change
    this.onIncidentTypeChange();

    // List incident types
    this.incidentTypes = [];
    this.incidentCategoryService.list(true).then(data => {
      this.incidentCategories = data;
      data.forEach(cat => this.incidentTypes = cat.incidentTypes.concat(this.incidentTypes));
    });
  }

  onIncidentTypeChange() {
    this.incidentForm.controls["incidentTypeId"].valueChanges.subscribe(id => {
      var incidentType: IncidentType = this.incidentTypes.find(i => i.id == id);
      this.incidentCategory = this.getIncidentCategory(incidentType);
      this.incidentForm.controls["incidentCategoryId"].setValue(this.incidentCategory.id);
      if (this.incidentCategory.id == 7) {
        this.healthAndSafety = true;
      } else {
        this.healthAndSafety = false;
      }
    });
  }

  getIncidentCategory(incidentType: IncidentType): IncidentCategory {
    return this.incidentCategories.find(cat => cat.incidentTypes.includes(incidentType));
  }

  async showLocationModal(event: any) {
    const modal = await this.modalController.create({
      component: LocationModalPage
    });
    return await modal.present();
  }
}