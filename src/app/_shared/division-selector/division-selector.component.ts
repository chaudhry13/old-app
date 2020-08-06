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

  constructor(
    private modalController: ModalController) { }

  ngOnInit() {
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: DivisionSelectorModalPage,
      cssClass: 'division-selector-modal',
      componentProps: {
        alreadysSelectedDivisionIds: this.selectedDivisionIds
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.selectedDivisionIds = data;
    this.changeInSelectedDivisions.emit(this.selectedDivisionIds);
  }
}
