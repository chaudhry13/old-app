import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DivisionSelectorModalPage } from 'src/app/modals/division-selector-modal/division-selector-modal.page';

@Component({
  selector: 'division-selector',
  templateUrl: './division-selector.component.html',
  styleUrls: ['./division-selector.component.scss']
})
export class DivisionSelectorComponent implements OnInit {
  @Input() public textSize: number = 0;
  @Input() public addIndividual: boolean = false;
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
        selectedDivisionIds: this.selectedDivisionIds,
        addIndividual: this.addIndividual
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

      if (index < this.textSize || this.textSize == 0) {
        stringResult += divisionName;
      } else {
        stringResult += "..."
        return stringResult;
      }

      if ((index != (divisionNames.length - 1) && index < this.textSize - 1) || ((index != (divisionNames.length - 1) && this.textSize == 0))) {
        stringResult += ", "
      }
    }

    return stringResult;
  }
}
