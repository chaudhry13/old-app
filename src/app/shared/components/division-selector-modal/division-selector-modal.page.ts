import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { DivisionList } from '@shared/models/division-list';

@Component({
  templateUrl: "./division-selector-modal.page.html",
  styleUrls: ["./division-selector-modal.page.scss"],
})
export class DivisionSelectorModalPage implements OnInit {

  @Input() public divisionList: DivisionList;

  constructor(private modalController: ModalController) {
  }

  ngOnInit() {
  }

  checkedDivisionsUpdated(divisionList) {
    this.divisionList = divisionList;
  }


  dismiss() {
    this.modalController.dismiss(this.divisionList);
  }
}
