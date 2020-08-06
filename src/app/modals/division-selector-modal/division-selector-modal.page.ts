import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DivisionService } from 'src/app/_services/division.service';
import { Division } from 'src/app/_models/division';

@Component({
  templateUrl: './division-selector-modal.page.html',
  styleUrls: ['./division-selector-modal.page.scss']
})
export class DivisionSelectorModalPage implements OnInit {
  @Input() setDivisions: EventEmitter<string[]>;
  @Input() userDivisions: Division[];
  @Input() addIndividual: boolean = false;
  @Input() updateDivisions: EventEmitter<Division[]>;
  @Input() alreadysSelectedDivisionIds: string[];
  @Output() selectionChanged = new EventEmitter<string[]>();

  public selectedDivisionIds: string[];

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  onDivisionChange(divisions) {
    this.selectionChanged.emit(divisions);
    this.selectedDivisionIds = divisions;
  }

  dismiss() {
    this.modalController.dismiss(this.selectedDivisionIds);
  }

}
