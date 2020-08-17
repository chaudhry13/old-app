import { Component, OnInit, Output, EventEmitter, Input, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { VehicleColor, VehicleMakes, VehicleModels } from 'src/app/_models/incident-report';

@Component({
  selector: 'vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss']
})
export class VehicleFormComponent implements OnInit {
  @Output() formChanges = new EventEmitter<FormArray>();

  constructor(
    private formBuilder: FormBuilder) { }

  vehiclesForm: FormGroup;
  vehicles: FormArray;
  vehiclesShown: VehiclesViewModel[] = [];

  vehicleMake = VehicleMakes;
  vehicleMakesNumbers = Object.keys(VehicleMakes).map(k => VehicleMakes[k]).filter(v => typeof v === "number");
  showMakeOther = false;

  vehicleModel = VehicleModels;
  vehicleModelsNumbers = Object.keys(VehicleModels).map(k => VehicleModels[k]).filter(v => typeof v === "number");
  showModelOther = false;

  vehicleColor = VehicleColor;
  vehicleColorNumbers = Object.keys(VehicleColor).map(k => VehicleColor[k]).filter(v => typeof v === "number");
  showColorOther = false;

  ngOnInit() {
    this.vehiclesForm = this.formBuilder.group({
      vehicles: this.formBuilder.array([])
    });

    this.addVehicle();

    this.vehiclesForm.valueChanges.subscribe(() => {
      this.formChanges.emit(this.vehicles);
    })
  }

  private createVehicle(): FormGroup {
    return this.formBuilder.group({
      vrm: [""],
      make: [0],
      makeOther: [""],
      model: [0],
      modelOther: [""],
      color: [0],
      colorOther: [""],
      description: [""]
    });
  }

  addVehicle(): void {
    this.vehicles = this.vehiclesForm.get('vehicles') as FormArray;
    this.vehicles.push(this.createVehicle());
    this.vehiclesShown.forEach(p => p.shown = false);
    this.vehiclesShown.push({ index: this.vehicles.length - 1, shown: true });
    this.formChanges.emit(this.vehicles);
  }

  removeVehicleAtIndex(index: number) {
    if (index <= 0) return;
    this.vehicles = this.vehiclesForm.get('vehicles') as FormArray;
    this.vehicles.removeAt(index);
    this.vehiclesShown.splice(index, 1);
    console.log(this.vehiclesShown);
  }

  toggleShowOfIndex(index: number) {
    this.vehiclesShown[index].shown = !this.vehiclesShown[index].shown;
  }

  onVehicleMakeSelection(selection) {
    if (selection.detail.value == 999) {
      this.showMakeOther = true;
    } else {
      this.showMakeOther = false;
    }
  }

  onVehicleModelSelection(selection) {
    console.log(selection.detail.value);
    if (selection.detail.value == 999) {
      this.showModelOther = true;
    } else {
      this.showModelOther = false;
    }
  }

  onVehicleColorSelection(selection) {
    if (selection.detail.value == 999) {
      this.showColorOther = true;
    } else {
      this.showColorOther = false;
    }
  }

}

export class VehiclesViewModel {
  index: number;
  shown: boolean = true;
}
