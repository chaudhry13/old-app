import {DropDownBuildingComponent} from "./models/building-components/dropdown-building-component";
import {Component, Input, OnInit} from "@angular/core";

@Component({
    selector: "app-dropdown-view",
    template: `
    <ion-card-header>
        <ion-card-subtitle>{{bc.label}}</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
        <ng-container *ngFor="let label of labels">
            <ion-badge style="margin-right: 5px">
                {{ label}}
            </ion-badge>
        </ng-container>
    </ion-card-content>
    
  `,
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
