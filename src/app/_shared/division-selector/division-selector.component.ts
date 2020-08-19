import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Division } from 'src/app/_models/division';
import { ModalController } from '@ionic/angular';
import { FormGroup } from '@angular/forms';
import { DivisionSelectorModalPage } from 'src/app/modals/division-selector-modal/division-selector-modal.page';
import { DivisionService } from 'src/app/_services/division.service';

@Component({
  selector: 'division-selector',
  templateUrl: './division-selector.component.html',
  styleUrls: ['./division-selector.component.scss']
})
export class DivisionSelectorComponent implements OnInit {
  @Output() public changeInSelectedDivisions = new EventEmitter<string[]>();

  public selectedDivisionIds: string[] = [];
  public selectedDivisionNames: string[] = [];
  public selectedDivisionsText: string = "Select divisions...";

  constructor(
    private modalController: ModalController) { }

  ngOnInit() {
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: DivisionSelectorModalPage,
      cssClass: 'division-selector-modal',
      componentProps: {
        selectedDivisionIds: this.selectedDivisionIds
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.selectedDivisionIds = data[0];
    this.selectedDivisionNames = data[1];
    if (data[1] && data[1].length > 0) {
      this.selectedDivisionsText = this.stringifyDivisionNames(data[1]);
    } else {
      this.selectedDivisionsText = "Select divisions...";
    }
    if (data) {
      this.changeInSelectedDivisions.emit(this.selectedDivisionIds);
    } else {
      this.changeInSelectedDivisions.emit([]);
    }
  }

  private stringifyDivisionNames(divisionNames: string[]): string {
    var stringResult = "";
    for (let index = 0; index < divisionNames.length; index++) {
      const divisionName = divisionNames[index];
      if (index < 3) {
        stringResult += divisionName;
        if (index != (divisionNames.length - 1)) {
          stringResult += ", "
        }
      } else {
        stringResult += "..."
        return stringResult;
      }
    }

    return stringResult;
  }
}
