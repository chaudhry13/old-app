import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Genders, Build, VehicleMakes, VehicleModels, VehicleColor } from 'src/app/_models/incident-report';

@Component({
  selector: 'observation-filter',
  templateUrl: './observation-filter.component.html',
  styleUrls: ['./observation-filter.component.scss']
})
export class ObservationFilterComponent implements OnInit {

  @Input() incidentReportFilter: FormGroup;

  genders = Object.keys(Genders).filter(e => !isNaN(+e)).map(o => { return { index: +o, name: Genders[o] } });
  builds = Object.keys(Build).filter(e => !isNaN(+e)).map(o => { return { index: +o, name: Build[o] } });

  vehicleMakes = Object.keys(VehicleMakes).filter(e => !isNaN(+e)).map(o => { return { index: +o, name: VehicleMakes[o] } });
  vehicleModels = Object.keys(VehicleModels).filter(e => !isNaN(+e)).map(o => { return { index: +o, name: VehicleModels[o] } });
  vehicleColors = Object.keys(VehicleColor).filter(e => !isNaN(+e)).map(o => { return { index: +o, name: VehicleColor[o] } });;

  public showColorOther: boolean = false;
  public showModelOther: boolean = false;
  public showMakeOther: boolean = false;

  public ageRangeForm: FormGroup;
  public heightRangeForm: FormGroup;
  public defaultAgeRangeValue = { lower: 10, upper: 60 };
  public defaultHeightRangeValue = { lower: 120, upper: 200 };
  public showFilters: boolean = false;

  constructor(formBuilder: FormBuilder) {
    this.ageRangeForm = formBuilder.group({
      ageRange: [""],
    });

    this.heightRangeForm = formBuilder.group({
      heightRange: [""],
    });
  }

  ngOnInit() {
    this.ageRangeForm.get("ageRange").setValue(this.defaultAgeRangeValue);
    this.ageRangeForm.valueChanges.subscribe(() => {
      this.incidentReportFilter.get("approxAgeMin").setValue(this.ageRangeForm.get("ageRange").value.lower);
      this.incidentReportFilter.get("approxAgeMax").setValue(this.ageRangeForm.get("ageRange").value.upper);
    });

    this.heightRangeForm.get("heightRange").setValue(this.defaultHeightRangeValue);
    this.heightRangeForm.valueChanges.subscribe(() => {
      this.incidentReportFilter.get("heightMin").setValue(this.heightRangeForm.get("heightRange").value.lower);
      this.incidentReportFilter.get("heightMax").setValue(this.heightRangeForm.get("heightRange").value.upper);
    });

    this.incidentReportFilter.controls.color.valueChanges.subscribe(value => {
      this.showColorOther = value.some(color => color == 999);
    });
    this.incidentReportFilter.controls.model.valueChanges.subscribe(value => {
      this.showModelOther = value.some(model => model == 999);
    });
    this.incidentReportFilter.controls.make.valueChanges.subscribe(value => {
      this.showMakeOther = value.some(make => make == 999);
    });
  }

  public toggleShowFilters() {
    this.showFilters = !this.showFilters;
  }
}

