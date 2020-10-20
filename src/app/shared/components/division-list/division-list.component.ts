import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Division } from "src/app/core/models/division";
import { DivisionService } from "src/app/core/services/division.service";
import { PopoverController, IonMenuToggle } from "@ionic/angular";
import { selectedItem } from "../division-item/division-item.component";

@Component({
  selector: "division-list",
  templateUrl: "./division-list.component.html",
  styleUrls: ["./division-list.component.scss"],
})
export class DivisionListComponent implements OnInit {
  @Input() public updateDivisions: EventEmitter<Division[]>;
  @Input() public readonly: boolean;
  @Input() public userDivisions: Division[];
  @Input() public selector: boolean;
  @Input() public setDivisions: EventEmitter<Division[]>;
  @Input() public addIndividual: boolean = false;
  @Input() public selectedNamesEmitter: EventEmitter<string[]>;
  @Input() public clearSelectionEvent?: EventEmitter<any>;

  //If this is true, it will return just the top-level divisions selected. If false, it will return all divisions selected
  @Input() public onlyTopLevel: boolean = true;

  @Output() public selected = new EventEmitter<string[]>();
  @Output() public selectedFull = new EventEmitter<Division[]>();

  public setDivisionsDown = new EventEmitter<string[]>();
  public clearChildren = new EventEmitter<any>();
  public divisions: Division[];
  public childrenSelected: selectedItem[] = [];
  public namesSelected: string[] = [];
  public showMenu: boolean = false;
  public inputDivisions: Division[];
  public tempInputDivisions: Division[];

  constructor(
    private divisionService: DivisionService,
    public popoverController: PopoverController
  ) {}

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

    if (this.clearSelectionEvent) {
      this.clearSelectionEvent.subscribe(() => {
        this.clearAll();
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

          var uniqueSelected = selected.filter((item, i, ar) => ar.findIndex(t => t.id === item.id) === i);

          this.inputDivisions = uniqueSelected;

          //Sets the individual divisions
          this.divisions = this.divisions.filter(div => !div.individualDivision || uniqueSelected.filter(d => d.individualDivision).some(u => u.id == div.id));

          //Sets the names which have been selected
          this.namesSelected = uniqueSelected.map(x => x.name);//this.namesFromIds(divisions);
          
          this.selectedNamesEmitter.emit(this.namesSelected);

          //Sets the children selected
          this.childrenSelected = this.getSelectedTree(uniqueSelected, this.divisions);
        }
      });
      this.setDivisionsFromGlobal(this.divisionService.get());
    }
  }

  onSelected(childItem: selectedItem) {
    if (this.addIndividual) {
      //Adding or removeing the child which has been clicked on
      this.childrenSelected = this.childrenSelected.filter(x => x.from != childItem.from);
      if (childItem.checked) {
        this.childrenSelected.push(childItem);
      }

      this.childrenSelected = this.childrenSelected.filter((item, i, ar) => ar.findIndex(t => t.selected[0].id === item.selected[0].id) === i);

      //Takes the divisions selected
      var selectedTopLevelDivisions: Division[] = [].concat(...this.childrenSelected.map(x => x.selected));
      var selectedDivisions: Division[] = this.onlyTopLevel ? selectedTopLevelDivisions : [].concat(...selectedTopLevelDivisions.map(division => this.getAllChildren(division)));
      selectedDivisions = selectedDivisions.filter((item, i, ar) => ar.findIndex(t => t.id === item.id) === i);

      //Only print the top-level names
      this.namesSelected = selectedTopLevelDivisions.map(x => x.name).filter((item, i, ar) => ar.findIndex(t => t === item) === i);;

      //Emit the selected divisions
      this.selected.emit(selectedDivisions.map(x => x.id));
      this.selectedFull.emit(selectedDivisions);
    }
    else {
      var child = this.childrenSelected.find(c => c.from == childItem.from);
      if (child) {
        this.childrenSelected.find(c => c.from == childItem.from).checked = childItem.checked;
        this.childrenSelected.find(c => c.from == childItem.from).selected = childItem.selected;
      }
      else {
        this.childrenSelected.push(childItem);
      }
      this.childrenSelected = this.childrenSelected.filter(x => x.checked);

      var divisions: Division[] = [].concat(...this.childrenSelected.map(x => x.selected));
      var selected: Division[];
      selected = this.buildDivisionTreeFromIds(divisions.map(d => d.id));

      var uniqueSelected = selected.filter((item, i, ar) => ar.findIndex(t => t.id === item.id) === i);

      console.log(uniqueSelected);
  
  
     // Sets the names which have been selected
      this.namesSelected = uniqueSelected.map(x => x.name);//this.namesFromIds(divisions);
      this.selectedNamesEmitter.emit(this.namesSelected);
      this.selected.emit(divisions.map(d => d.id));
      this.selectedFull.emit(divisions);
    }
  }

  clearAll() {
    this.inputDivisions = [];
    this.childrenSelected = [];
    this.namesSelected = [];
    this.selected.emit([]);
    this.selectedFull.emit([]);
    this.selectedNamesEmitter.emit(this.namesSelected);
    this.clearChildren.emit();
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
      this.divisionService.list().then((divisions) => {
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

  private setDivisionsFromGlobal(divisions: any) {
    this.setDivisions.emit(divisions);
  }
}
