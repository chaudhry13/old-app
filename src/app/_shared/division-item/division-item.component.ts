import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { DivisionService } from 'src/app/_services/division.service';
import { Division } from 'src/app/_models/division';
import { ToastService } from 'src/app/_services/toast.service';

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
  @Input() isTopLevel?: boolean;
  @Input() inputDivisions: string[] = [];

  @Output() onSelect = new EventEmitter<selectedItem>();
  @Output() list = new EventEmitter();

  public setDivisionsDown = new EventEmitter<string[]>();
  public showChildren: boolean = false;

  public checked: boolean;

  public selected: Division[] = [];
  public childrenSelected: selectedItem[] = [];

  constructor() { }

  ngOnInit() {
    this.checked = this.isParrentChecked;
    this.setInputDivision(this.inputDivisions);
  }

  ngOnChanges() {
    this.checked = this.isParrentChecked;

    //If this Id is contained in the input divisions, then mark it.
    this.setInputDivision(this.inputDivisions);
  }

  setInputDivision(divisions: string[]) {
    if (!this.selector) return;

    //Sets children selected:
    if (this.hasChildren()) {
      this.division.children.forEach(child => {
        if (divisions.some(div => child.id == div)) {
          this.childrenSelected.push({
            selected: [child],
            checked: true,
            from: child.id
          });
        }
      });
    }

    //Set it self
    if (divisions.some(d => d == this.division.id)) {
      this.checked = true;
    }
  }

  onChange(check) {
    //If a change has been made in the check, then return the result
    this.selected = []
    this.selected.push(this.division);

    let item: selectedItem = {
      selected: this.selected,
      checked: this.checked,
      from: this.division.id
    };

    this.onSelect.emit(item);
  }

  //A child has been selected.
  childSelected(childItem: selectedItem) {
    this.childrenSelected = this.childrenSelected.filter(x => x.from != childItem.from);

    if (childItem.checked) {
      this.childrenSelected.push(childItem);
    }
    this.checked = false;

    let selectedDivisions = [].concat(...this.childrenSelected.map(x => x.selected));
    let item: selectedItem = {
      selected: selectedDivisions,
      checked: this.childrenSelected.some(c => c.checked),
      from: this.division.id
    }
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
