import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormArray } from "@angular/forms";

@Component({
  selector: "intelligence-report-form",
  templateUrl: "./intelligence-report-form.component.html",
  styleUrls: ["./intelligence-report-form.component.scss"],
})
export class IntelligenceReportFormComponent implements OnInit {
  @Input() incidentForm: FormGroup;

  public currentDate: string = new Date().toISOString();

  constructor() {}

  ngOnInit() {}

  public onPersonsFormChanges(persons) {
    this.incidentForm.get("persons").setValue(persons);
  }

  public onVehicleFormChanges(vehicles) {
    this.incidentForm.get("vehicles").setValue(vehicles);
  }
}
