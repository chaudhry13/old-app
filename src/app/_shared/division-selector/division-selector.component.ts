import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Division } from 'src/app/_models/division';
import { ModalController } from '@ionic/angular';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'division-selector',
  templateUrl: './division-selector.component.html',
  styleUrls: ['./division-selector.component.scss']
})
export class DivisionSelectorComponent implements OnInit {
  @Input() setDivisions: EventEmitter<string[]>;
  @Input() userDivisions: Division[];
  @Input() addIndividual: boolean = false;
  @Input() updateDivisions: EventEmitter<Division[]>;
  @Input() form: FormGroup;
  @Output() selectionChanged = new EventEmitter<string[]>();

  public selectedDivisions: string[];

  // TODO: Should know which divisions that are already selected

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    console.log("From selector:");
    console.log(this.form)
    console.log(this.form.controls.divisionIds.value);
    this.selectedDivisions = this.form.controls.divisionIds.value;
  }

  onDivisionChange(divisions) {
    this.selectedDivisions = divisions;
  }

  dismiss() {
    this.modalController.dismiss(this.selectedDivisions);
  }

}
