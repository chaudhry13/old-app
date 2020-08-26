import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';
import { Division } from 'src/app/_models/division';

@Component({
  selector: 'division-item',
  templateUrl: './division-item.component.html',
  styleUrls: ['./division-item.component.scss']
})
export class DivisionItemComponent implements OnInit, OnChanges {
  @Input() division: Division;
  @Input() readonly: boolean;
  @Input() selector: boolean;
  @Input() isParrentChecked: boolean;
  @Input() addIndividual: boolean;
  @Input() parentChildrenSelected: selectedItem[] = [];
  @Input() inputDivisions: Division[];

  @Output() onSelect = new EventEmitter<selectedItem>();
  @Output() list = new EventEmitter();

  public setDivisionsDown = new EventEmitter<string[]>();
  public showChildren: boolean = false;

  public checked: boolean;

  public childrenSelected: selectedItem[] = [];

  constructor() { }

  ngOnInit() {
     //this.checked = this.isParrentChecked;
     if (!this.addIndividual) { this.checked = this.isParrentChecked; }
     else {
       this.checked = this.setSelected(this.parentChildrenSelected);
     }
    this.setInputDivision(this.inputDivisions);

    this.showDivisionsWithCheckedChildren();
  }

  ngOnChanges(changes) {
    if (changes.isParrentChecked) {
      if (!this.addIndividual) { this.checked = this.isParrentChecked; }
      else if (!this.isParrentChecked) { this.checked = false; }
    }

    this.setInputDivision(this.inputDivisions);

    this.showDivisionsWithCheckedChildren();
  }

  setSelected(selected: selectedItem[]): boolean {
    var chosenDivisions: Division[] = [].concat(...selected.map(s => s.selected));
    return this.setSelectedHelper(this.division, chosenDivisions);
  }

  setSelectedHelper(division: Division, checkDivisions: Division[]): boolean {
    if (checkDivisions.some(c => c.id == division.id)) {
      return true;
    }
    else {
      if (division.children && division.children.length > 0) {
        return division.children.some(child => this.setSelectedHelper(child, checkDivisions));
      }
      else {
        return false;
      }
    }
  }

  async hasCheckedChild(division: Division): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.inputDivisions.some(d => d.id == division.id)) {
        resolve(true);
      }
      if (division.children) {
        division.children.forEach(child => {
          resolve(this.hasCheckedChild(child));
        });
      } else {
        resolve(false);
      }
    });
  }

  private showDivisionsWithCheckedChildren() {
    if (!this.selector) return;

    if (this.checked) {
      this.showChildren = true;
    }
    this.hasCheckedChild(this.division).then(shouldShow => {
      if (shouldShow) {
        this.showChildren = true;
      }
    });
  }

  setInputDivision(divisions: Division[]) {
    if (!this.selector) return;

    //Sets children selected:
    if (this.hasChildren()) {
      this.division.children.forEach(child => {
        if (divisions.some(div => child.id == div.id)) {
          this.childrenSelected.push({
            selected: [child],
            checked: true,
            from: child.id
          });
        }
      });
    }

    //Set it self
    if (divisions.some(d => d.id == this.division.id)) {
      this.checked = true;
    }
  }

  getItem(): selectedItem {
    return {
      selected: [this.division],
      checked: this.checked,
      from: this.division.id
    };
  }

  onChange(check) {
    //If a change has been made in the check, then return the result
    this.onSelect.emit(this.getItem());
  }

  //A child has been selected.
  childSelected(childItem: selectedItem) {
    this.checked = this.addIndividual;

    //If a child has been selected then remove the child:
    this.childrenSelected = this.childrenSelected.filter(x => x.from != childItem.from);

    //If the child is checked. Then add the child again:
    if (childItem.checked) {
      this.childrenSelected.push(childItem);
    }
    if (childItem.checked && this.addIndividual) {
      this.childrenSelected = this.childrenSelected.filter(x => x.from != this.division.id);
    }
    else if (!childItem.checked && this.addIndividual && !this.setSelected(this.parentChildrenSelected)) {
      this.childrenSelected.push(this.getItem());
    }

    //Removes duplicates (don't know why there are duplicates, but they are there);
    this.childrenSelected = this.childrenSelected.filter(
      (thing, i, arr) => arr.findIndex(t => t.from === thing.from) === i
    );

    //create the item and return
    let selectedDivisions: Division[] = [].concat(...this.childrenSelected.map(x => x.selected));
    var item: selectedItem = {
      selected: selectedDivisions,
      checked: this.childrenSelected.some(c => c.checked),
      from: this.division.id
    };
    this.onSelect.emit(item);
  }

  toggleCheck() {
    this.checked = !this.checked;
  }

  hasChildren() {
    return this.division.children && this.division.children.length > 0;
  }

  trackById = (item) => item.Id;
}

export class selectedItem {
  selected: Division[];
  checked: boolean;
  from: string;
}
