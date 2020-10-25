import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { Division } from '@app/models/division';
import { DivisionService } from '@app/services/division.service';
import { ModalController } from "@ionic/angular";
import { DivisionList } from '@shared/models/division-list';
import { DivisionNode } from '@shared/models/division-node';
import { DivisionSelectorModalPage } from "src/app/shared/components/division-selector-modal/division-selector-modal.page";

@Component({
  selector: "division-selector",
  templateUrl: "./division-selector.component.html",
  styleUrls: ["./division-selector.component.scss"],
})
export class DivisionSelectorComponent implements OnInit {
  @Input() public textSize: number = 0;
  @Input() public addIndividual: boolean = false;
  @Input() public asFilter: boolean = true;
  @Output() public changeInSelectedDivisions = new EventEmitter<string[]>();

  public divisionList: DivisionList;
  public selectedDivisionIds: string[] = [];
  public selectedDivisionNames: string[] = [];
  public selectedDivisionsText: string = "Select divisions...";

  constructor(private modalController: ModalController, private divisionService: DivisionService) {}

  ngOnInit() {
    this.divisionList = new DivisionList();
    this.divisionList.asFilter = this.asFilter;
    this.listDivisions().then(divisions => {
      this.divisionList.makeDivisionNodes(divisions);
    });
  }

  public async listDivisions() {
    return this.divisionService.list();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: DivisionSelectorModalPage,
      cssClass: "division-selector-modal",
      componentProps: {
        divisionList: this.divisionList
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.divisionList = data;
    this.selectedDivisionIds = this.divisionList.getCheckedDivisions().map(divNode => divNode.division.id)
    this.selectedDivisionNames = this.divisionList.getCheckedDivisions().map(divNode => divNode.division.name)

    if (this.selectedDivisionNames && this.selectedDivisionNames.length > 0) {
      this.selectedDivisionsText = this.stringifyDivisionNames(this.selectedDivisionNames);
      this.changeInSelectedDivisions.emit(this.selectedDivisionIds);
    } else {
      this.selectedDivisionsText = "Select divisions...";
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
        stringResult +=
          " (and " + (divisionNames.length - this.textSize) + " more...)";
        return stringResult;
      }

      if (
        (index != divisionNames.length - 1 && index < this.textSize - 1) ||
        (index != divisionNames.length - 1 && this.textSize == 0)
      ) {
        stringResult += ", ";
      }
    }

    return stringResult;
  }
}
