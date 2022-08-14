import {DropDownBuildingComponent} from "./models/building-components/dropdown-building-component";
import {Component, Input, OnInit} from "@angular/core";

@Component({
    selector: "app-dropdown-view",
    template: `
    <span class="badge badge-pill badge-primary p1 mr-2" *ngFor="let label of labels">{{
          label
        }}</span>
  `,
    styles: [
    ]
})
export class DropdownViewComponent implements OnInit {
    @Input() bc: DropDownBuildingComponent;
    labels: string[];

    constructor() { }

    ngOnInit(): void {
        if(!this.bc.dropDownOptions.value) return;
        const values = this.bc.dropDownOptions.value.split(",");
        this.labels = values.map(value => this.bc.dropDownOptions.options.find(option => option.id === value).label);
    }

}
