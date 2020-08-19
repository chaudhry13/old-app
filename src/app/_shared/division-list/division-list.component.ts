import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Division } from 'src/app/_models/division';
import { DivisionService } from 'src/app/_services/division.service';
import { PopoverController } from '@ionic/angular';
import { selectedItem } from '../division-item/division-item.component';

@Component({
  selector: 'division-list',
  templateUrl: './division-list.component.html',
  styleUrls: ['./division-list.component.scss']
})
export class DivisionListComponent implements OnInit {
  @Input() public updateDivisions: EventEmitter<Division[]>;
  @Input() public readonly: boolean;
  @Input() public userDivisions: Division[];
  @Input() public selector: boolean;
  @Input() public setDivisions: EventEmitter<Division[]>;
  @Input() public addIndividual: boolean = false;

  //If this is true, it will return just the top-level divisions selected. If false, it will return all divisions selected
  @Input() public onlyTopLevel: boolean = true;

  @Output() public selected = new EventEmitter<string[]>();
  @Output() public selectedFull = new EventEmitter<Division[]>();

  public setDivisionsDown = new EventEmitter<string[]>();
  public divisions: Division[];
  public childrenSelected: selectedItem[] = [];
  public namesSelected: string[] = [];
  public showMenu: boolean = false;
  public inputDivisions: Division[];
  public tempInputDivisions: Division[];

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

    if (this.setDivisions) {
      this.setDivisions.subscribe(divisions => {
        if (!this.divisions && !this.userDivisions) {
          //No divisions has been given or loaded.
          //Saves the input divisions to a different variable
          this.tempInputDivisions = divisions;
        }
        else {
          //sends the selected divisions down the tree
          var selected: Division[];
          if (typeof divisions[0] == "string") {
            selected = this.buildDivisionTreeFromIds(divisions);
          }
          else {
            selected = <Division[]>divisions;
          }

          this.inputDivisions = selected;

          //Sets the individual divisions
          this.divisions = this.divisions.concat(selected.filter(d => d.individualDivision));

          //Sets the names which have been selected
          this.namesSelected = selected.map(x => x.name);//this.namesFromIds(divisions);
          console.log(this.namesSelected);

          //Sets the children selected
          this.childrenSelected = this.getSelectedTree(selected, this.divisions);
        }
      });
    }
  }

  onSelected(childItem: selectedItem) {
    //Adding or removeing the child which has been clicked on
    this.childrenSelected = this.childrenSelected.filter(x => x.from != childItem.from);
    if (childItem.checked) {
      this.childrenSelected.push(childItem);
    }

    //Takes the divisions selected
    var selectedTopLevelDivisions: Division[] = [].concat(...this.childrenSelected.map(x => x.selected));
    let selectedDivisions: Division[] = this.onlyTopLevel ? selectedTopLevelDivisions : [].concat(...selectedTopLevelDivisions.map(division => this.getAllChildren(division)));

    //Only print the top-level names
    this.namesSelected = selectedTopLevelDivisions.map(x => x.name);

    //Emit the selected divisions
    this.selected.emit(selectedDivisions.map(x => x.id));
    this.selectedFull.emit(selectedDivisions);
  }

  clearAll() {
    this.inputDivisions = [];
    this.childrenSelected = [];
    this.namesSelected = [];
    this.selected.emit([]);
    this.selectedFull.emit([]);
  }

  getAllChildren(division: Division): Division[] {
    var result: Division[] = [division];
    if (division.children) {
      division.children.forEach(child => {
        result = result.concat(this.getAllChildren(child));
      });
    }
    return result;
  }

  listDivisions() {
    if (this.userDivisions) {
      this.divisions = this.userDivisions;
      this.setDivisions.emit(this.inputDivisions);
      if (this.tempInputDivisions) {
        this.setDivisions.emit(this.tempInputDivisions);
        this.tempInputDivisions = undefined;
      }
    } else {
      this.divisionService.list().then(divisions => {
        this.divisions = divisions;

        if (this.tempInputDivisions) {
          this.setDivisions.emit(this.tempInputDivisions);
          this.tempInputDivisions = undefined;
        }
      });
    }
  }

  buildDivisionTreeFromIds(divisions: string[]): Division[] {
    return this.buildDivisionTreeFromIdsHelper(divisions, this.divisions)
  }

  buildDivisionTreeFromIdsHelper(divisions: string[], possible: Division[]): Division[] {
    var result: Division[] = [];

    possible.forEach(div => {
      if (divisions.includes(div.id)) {
        result.push(div);
      }
      else {
        if (div.children) {
          result = result.concat(this.buildDivisionTreeFromIdsHelper(divisions, div.children));
        }
      }
    });

    return result;
  }

  hasChild(division: Division): boolean {
    return division.children && division.children.length > 0;
  }

  getSelectedTree(divs: Division[], divisions: Division[]): selectedItem[] {
    var result: selectedItem[] = [];

    divisions.forEach(division => {
      //If this division is selected
      if (divs.some(div => division.id == div.id)) {
        result.push({
          selected: [division],
          checked: true,
          from: division.id
        });
      }
      else if (this.hasChild(division)) {
        var selected = this.getSelectedTree(divs, division.children);
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

  trackById = (item) => item.Id;

}
