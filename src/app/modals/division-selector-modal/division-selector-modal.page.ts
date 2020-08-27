import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DivisionService } from 'src/app/_services/division.service';
import { Division } from 'src/app/_models/division';

@Component({
  templateUrl: './division-selector-modal.page.html',
  styleUrls: ['./division-selector-modal.page.scss']
})
export class DivisionSelectorModalPage implements OnInit {
  @Input() userDivisions: Division[];
  @Input() addIndividual: boolean = false;
  @Input() updateDivisions: EventEmitter<Division[]>;
  @Input() onlyTopLevel: boolean = false;
  @Output() selectionChanged = new EventEmitter<string[]>();
  @Output() selectionChangedFull = new EventEmitter<Division[]>();

  @Input() selectedDivisionIds: string[];
  public setDivisions: EventEmitter<string[]>;
  public selectedNamesEmitter = new EventEmitter<string[]>();
  public divisionsSelected: Division[];
  public selectedDivisionNames: string[] = [];
  public clearSelectionEvent = new EventEmitter<any>();

  constructor(private modalController: ModalController) {
    this.setDivisions = new EventEmitter<string[]>();
  }

  ngOnInit() {
    this.selectedNamesEmitter.subscribe(divisionNames => {
      this.selectedDivisionNames = divisionNames;
    });
  }

  ionViewDidEnter() {
    this.setDivisions.emit(this.selectedDivisionIds);
  }

  onDivisionChange(divisions) {
    this.selectionChanged.emit(divisions);
    this.selectedDivisionIds = divisions;
  }

  onDivisionChangeFull(divisions) {
    this.selectionChangedFull.emit(divisions);
    this.divisionsSelected = divisions;
  }

  clearSelection() {
    console.log("Clear!");
    this.clearSelectionEvent.emit();
  }

  dismiss() {
    this.modalController.dismiss([this.selectedDivisionIds, this.selectedDivisionNames]);
  }

}
