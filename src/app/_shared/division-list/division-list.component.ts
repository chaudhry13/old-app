import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Division } from 'src/app/_models/division';
import { DivisionService } from 'src/app/_services/division.service';
import { selectedItem } from '../division-item/division-item.component';
import { PopoverController } from '@ionic/angular';
import { DivisionSelectorComponent } from '../division-selector/division-selector.component';

@Component({
  selector: 'division-list',
  templateUrl: './division-list.component.html',
  styleUrls: ['./division-list.component.scss']
})
export class DivisionListComponent implements OnInit {
  @Input() public updateDivisions: EventEmitter<any>;
  @Input() public readonly: boolean;
  @Input() public userDivisions: Division[];
  @Input() public selector: boolean;
  @Input() public setDivisions: EventEmitter<string[]>;
  @Input() public addIndividual: boolean;
  @Input() public selectedDivisions: string[];
  @Output() public selected = new EventEmitter<string[]>();

  public setDivisionsDown = new EventEmitter<string[]>();
  public divisions: Division[];
  public childrenSelected: selectedItem[] = [];
  public namesSelected: string[] = [];
  public showMenu: boolean = false;
  public inputDivisions: string[] = [];

  constructor(private divisionService: DivisionService, public popoverController: PopoverController) { }

  ngOnInit() {
    this.listDivisions();
    if (this.updateDivisions) {
      this.updateDivisions.subscribe(divisions => {
        if (divisions) {
          this.userDivisions = divisions;
        }
        this.listDivisions();
      });
    }

    setTimeout(() => {
      console.log(this.selectedDivisions)
      if (this.selectedDivisions || true) {
        //sends the selected divisions down the tree
        this.inputDivisions = <string[]>this.selectedDivisions;

        //Sets the names which have been selected
        this.namesSelected = this.namesFromIds(this.selectedDivisions);

        //Sets the children selected
        this.childrenSelected = this.getSelectedTree(this.selectedDivisions, this.divisions);
      }
    }, 6000);
  }

  listDivisions() {
    if (this.userDivisions) {
      this.divisions = this.userDivisions;
      this.setDivisions.emit(this.inputDivisions);
    } else {
      this.divisionService.list().then(divisions => {
        this.divisions = divisions;
      });
    }
  }

  onSelected(childItem: selectedItem) {
    console.log("on select");
    this.childrenSelected = this.childrenSelected.filter(x => x.from != childItem.from);

    if (childItem.checked) {
      this.childrenSelected.push(childItem);
    }

    let selectedDivisions: Division[] = [].concat(...this.childrenSelected.map(x => x.selected));
    this.namesSelected = selectedDivisions.map(x => x.name)
    this.selected.emit(selectedDivisions.map(x => x.id));
  }

  trackById = (item) => item.Id;

  namesFromIds(ids: string[]): string[] {
    return this.checkChild(ids, this.divisions);
  }

  checkChild(ids: string[], divisions: Division[]): string[] {
    var result: string[] = [];
    divisions.forEach(division => {
      if (ids.some(id => division.id == id)) {
        result.push(division.name);
      }
      if (this.hasChild(division)) {
        result = result.concat(this.checkChild(ids, division.children));
      }
    });
    console.log(result)
    return result;
  }

  hasChild(division: Division): boolean {
    return division.children && division.children.length > 0;
  }

  getSelectedTree(ids: string[], divisions: Division[]): selectedItem[] {
    var result: selectedItem[] = [];

    divisions.forEach(division => {
      //If this division is selected
      if (ids.some(id => division.id == id)) {
        result.push({
          selected: [division],
          checked: true,
          from: division.id
        });
      }
      else if (this.hasChild(division)) {
        var selected = this.getSelectedTree(ids, division.children);
        //If a child has been selected
        if (selected.some(s => s.selected.length > 0)) {
          result.push({
            selected: [].concat(...selected.map(s => s.selected)),
            from: division.id,
            checked: false,
          });
        }
      }
    });

    return result;
  }

}
